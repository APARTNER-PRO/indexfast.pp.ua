-- ══════════════════════════════════════════════
-- MySQL 5.7 сумісна версія
-- ══════════════════════════════════════════════
-- ══════════════════════════════════════════════
--  IndexFast — schema_v3.sql
--  Job Queue: запускати після schema_v2.sql
-- ══════════════════════════════════════════════
SET NAMES utf8mb4;

-- ── Credentials окремо від sites (не тягнемо MEDIUMTEXT в кожен SELECT)
CREATE TABLE IF NOT EXISTS `site_credentials` (
  `site_id`           INT UNSIGNED NOT NULL,
  `service_account`   MEDIUMTEXT   NOT NULL,   -- base64(JSON)
  `updated_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`site_id`),
  CONSTRAINT `fk_cred_site` FOREIGN KEY (`site_id`)
    REFERENCES `sites`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Перенесемо існуючі credentials (якщо є)
-- Виконується тільки якщо колонка service_account ще існує в sites
SET @migrate_sql = (
  SELECT IF(
    COUNT(*) > 0,
    'INSERT IGNORE INTO `site_credentials` (site_id, service_account) SELECT id, service_account FROM `sites` WHERE service_account IS NOT NULL',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'sites'
    AND COLUMN_NAME  = 'service_account'
);
PREPARE migrate_stmt FROM @migrate_sql;
EXECUTE migrate_stmt;
DEALLOCATE PREPARE migrate_stmt;

-- Прибираємо service_account з sites (буде в окремій таблиці)
-- Додаємо колонки тільки якщо їх немає (MySQL 5.7 не підтримує IF NOT EXISTS)
SET @col1 = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='sites' AND COLUMN_NAME='sitemap_last_parsed');
SET @sql1 = IF(@col1=0, 'ALTER TABLE `sites` ADD COLUMN `sitemap_last_parsed` DATETIME DEFAULT NULL', 'SELECT 1');
PREPARE s1 FROM @sql1; EXECUTE s1; DEALLOCATE PREPARE s1;

SET @col2 = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='sites' AND COLUMN_NAME='sitemap_url_count');
SET @sql2 = IF(@col2=0, 'ALTER TABLE `sites` ADD COLUMN `sitemap_url_count` INT UNSIGNED NOT NULL DEFAULT 0', 'SELECT 1');
PREPARE s2 FROM @sql2; EXECUTE s2; DEALLOCATE PREPARE s2;

-- ── Черга завдань
CREATE TABLE IF NOT EXISTS `jobs` (
  `id`            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`       INT UNSIGNED     NOT NULL,
  `site_id`       INT UNSIGNED     NOT NULL,
  `type`          ENUM('index_urls') NOT NULL DEFAULT 'index_urls',

  -- Payload: список URL для відправки (JSON array)
  `payload`       JSON             NOT NULL,

  -- Стан
  `status`        ENUM('pending','processing','done','failed','cancelled')
                  NOT NULL DEFAULT 'pending',
  `priority`      TINYINT UNSIGNED NOT NULL DEFAULT 5,  -- 1=high, 10=low

  -- Прогрес
  `total`         SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `sent`          SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `failed`        SMALLINT UNSIGNED NOT NULL DEFAULT 0,

  -- Retry
  `attempts`      TINYINT UNSIGNED  NOT NULL DEFAULT 0,
  `max_attempts`  TINYINT UNSIGNED  NOT NULL DEFAULT 3,
  `last_error`    VARCHAR(500)      DEFAULT NULL,

  -- Часові мітки
  `available_at`  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- коли можна обробляти
  `started_at`    DATETIME          DEFAULT NULL,
  `finished_at`   DATETIME          DEFAULT NULL,
  `created_at`    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),

  -- Воркер дивиться на ці індекси
  INDEX `idx_worker`       (`status`, `priority`, `available_at`),
  INDEX `idx_user_status`  (`user_id`, `status`, `created_at`),
  INDEX `idx_site_status`  (`site_id`, `status`),

  CONSTRAINT `fk_jobs_user` FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jobs_site` FOREIGN KEY (`site_id`)
    REFERENCES `sites`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Додаємо job_id до indexing_log (щоб знати з якого job прийшов запис)
SET @c1=(SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='indexing_log' AND COLUMN_NAME='job_id');
SET @q1=IF(@c1=0,'ALTER TABLE `indexing_log` ADD COLUMN `job_id` BIGINT UNSIGNED DEFAULT NULL','SELECT 1');
PREPARE p1 FROM @q1; EXECUTE p1; DEALLOCATE PREPARE p1;

SET @i1=(SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='indexing_log' AND INDEX_NAME='idx_job_id');
SET @q2=IF(@i1=0,'ALTER TABLE `indexing_log` ADD INDEX `idx_job_id` (`job_id`)','SELECT 1');
PREPARE p2 FROM @q2; EXECUTE p2; DEALLOCATE PREPARE p2;

-- ── Індекси яких бракувало раніше
SET @i2=(SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='daily_usage' AND INDEX_NAME='idx_usage_date');
SET @q3=IF(@i2=0,'ALTER TABLE `daily_usage` ADD INDEX `idx_usage_date` (`usage_date`)','SELECT 1');
PREPARE p3 FROM @q3; EXECUTE p3; DEALLOCATE PREPARE p3;

SET @i3=(SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='indexing_log' AND INDEX_NAME='idx_created_at');
SET @q4=IF(@i3=0,'ALTER TABLE `indexing_log` ADD INDEX `idx_created_at` (`created_at`)','SELECT 1');
PREPARE p4 FROM @q4; EXECUTE p4; DEALLOCATE PREPARE p4;

-- ── MySQL конфіг підказки (запустити вручну або через my.cnf)
-- SET GLOBAL innodb_buffer_pool_size    = 512*1024*1024;  -- 512MB
-- SET GLOBAL query_cache_type           = 0;               -- вимкнути (застаріло в 8.0)
-- SET GLOBAL max_connections            = 200;
-- SET GLOBAL innodb_flush_log_at_trx_commit = 2;          -- менш строго, швидше
-- SET GLOBAL innodb_io_capacity         = 2000;
