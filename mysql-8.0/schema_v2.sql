-- ══════════════════════════════════════════════
--  IndexFast — schema_v2.sql
--  Запускати ПІСЛЯ існуючої schema.sql
-- ══════════════════════════════════════════════
SET NAMES utf8mb4;

-- ── Замінюємо ENUM plan в users (якщо інший)
ALTER TABLE `users`
  MODIFY COLUMN `plan` ENUM('start','pro','agency') NOT NULL DEFAULT 'start';

-- ── Сайти користувача
CREATE TABLE IF NOT EXISTS `sites` (
  `id`               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`          INT UNSIGNED  NOT NULL,
  `domain`           VARCHAR(255)  NOT NULL,
  `sitemap_url`      VARCHAR(1000) NOT NULL,
  `service_account`  MEDIUMTEXT    DEFAULT NULL,   -- base64(JSON ключ)
  `status`           ENUM('active','paused','error') NOT NULL DEFAULT 'active',
  `error_message`    VARCHAR(500)  DEFAULT NULL,
  `total_urls`       INT UNSIGNED  NOT NULL DEFAULT 0,
  `indexed_total`    INT UNSIGNED  NOT NULL DEFAULT 0,
  `last_run_at`      DATETIME      DEFAULT NULL,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  CONSTRAINT `fk_sites_user` FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Лог відправок в Google Indexing API
CREATE TABLE IF NOT EXISTS `indexing_log` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `site_id`     INT UNSIGNED    NOT NULL,
  `user_id`     INT UNSIGNED    NOT NULL,
  `url`         VARCHAR(2048)   NOT NULL,
  `status`      ENUM('ok','error','pending') NOT NULL DEFAULT 'pending',
  `http_status` SMALLINT UNSIGNED DEFAULT NULL,
  `error_msg`   VARCHAR(500)    DEFAULT NULL,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_user_date`  (`user_id`, `created_at`),
  INDEX `idx_site_id`    (`site_id`),
  CONSTRAINT `fk_log_site` FOREIGN KEY (`site_id`)
    REFERENCES `sites`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Денний ліміт (скидається щодня)
CREATE TABLE IF NOT EXISTS `daily_usage` (
  `id`           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`      INT UNSIGNED  NOT NULL,
  `usage_date`   DATE          NOT NULL,
  `urls_sent`    INT UNSIGNED  NOT NULL DEFAULT 0,
  `urls_limit`   SMALLINT UNSIGNED NOT NULL DEFAULT 20,
  `updated_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_date` (`user_id`, `usage_date`),
  CONSTRAINT `fk_daily_user` FOREIGN KEY (`user_id`)
    REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
