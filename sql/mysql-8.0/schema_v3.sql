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
INSERT IGNORE INTO `site_credentials` (site_id, service_account)
  SELECT id, service_account FROM `sites` WHERE service_account IS NOT NULL;

-- Прибираємо service_account з sites (буде в окремій таблиці)
ALTER TABLE `sites`
  ADD COLUMN IF NOT EXISTS `sitemap_last_parsed` DATETIME DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `sitemap_url_count`   INT UNSIGNED NOT NULL DEFAULT 0;

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
ALTER TABLE `indexing_log`
  ADD COLUMN IF NOT EXISTS `job_id` BIGINT UNSIGNED DEFAULT NULL,
  ADD INDEX IF NOT EXISTS `idx_job_id` (`job_id`);

-- ── Індекси яких бракувало раніше
ALTER TABLE `daily_usage`
  ADD INDEX IF NOT EXISTS `idx_usage_date` (`usage_date`);

ALTER TABLE `indexing_log`
  ADD INDEX IF NOT EXISTS `idx_created_at` (`created_at`);

-- ── MySQL конфіг підказки (запустити вручну або через my.cnf)
-- SET GLOBAL innodb_buffer_pool_size    = 512*1024*1024;  -- 512MB
-- SET GLOBAL query_cache_type           = 0;               -- вимкнути (застаріло в 8.0)
-- SET GLOBAL max_connections            = 200;
-- SET GLOBAL innodb_flush_log_at_trx_commit = 2;          -- менш строго, швидше
-- SET GLOBAL innodb_io_capacity         = 2000;
