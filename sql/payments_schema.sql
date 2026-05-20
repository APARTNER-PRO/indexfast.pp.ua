-- ══════════════════════════════════════════════
--  payments_schema.sql
--  Сумісність: MySQL 5.7.8+, MySQL 8.0+, MariaDB 10.3+
--
--  MySQL 5.7 особливості врахованого:
--  - ADD COLUMN IF NOT EXISTS не підтримується → PREPARE/EXECUTE
--  - ADD CONSTRAINT IF NOT EXISTS не підтримується → PREPARE/EXECUTE
--  - JSON колонка → MEDIUMTEXT (JSON є з 5.7.8, але MEDIUMTEXT надійніше)
--  - DEFAULT CURRENT_TIMESTAMP ON UPDATE → підтримується з 5.6+
-- ══════════════════════════════════════════════

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ════════════════════════════════════════════
--  1. РОЗШИРЕННЯ ТАБЛИЦІ users
-- ════════════════════════════════════════════

SET @c = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'plan_started_at');
SET @s = IF(@c = 0, 'ALTER TABLE `users` ADD COLUMN `plan_started_at` DATETIME DEFAULT NULL', 'SELECT 1');
PREPARE _st FROM @s; EXECUTE _st; DEALLOCATE PREPARE _st;

SET @c = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'plan_expires_at');
SET @s = IF(@c = 0, 'ALTER TABLE `users` ADD COLUMN `plan_expires_at` DATETIME DEFAULT NULL', 'SELECT 1');
PREPARE _st FROM @s; EXECUTE _st; DEALLOCATE PREPARE _st;

SET @c = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'active_subscription_id');
SET @s = IF(@c = 0, 'ALTER TABLE `users` ADD COLUMN `active_subscription_id` INT UNSIGNED DEFAULT NULL', 'SELECT 1');
PREPARE _st FROM @s; EXECUTE _st; DEALLOCATE PREPARE _st;

SET @c = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'paddle_customer_id');
SET @s = IF(@c = 0, 'ALTER TABLE `users` ADD COLUMN `paddle_customer_id` VARCHAR(100) DEFAULT NULL', 'SELECT 1');
PREPARE _st FROM @s; EXECUTE _st; DEALLOCATE PREPARE _st;

SET @c = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'paddle_sub_id');
SET @s = IF(@c = 0, 'ALTER TABLE `users` ADD COLUMN `paddle_sub_id` VARCHAR(100) DEFAULT NULL', 'SELECT 1');
PREPARE _st FROM @s; EXECUTE _st; DEALLOCATE PREPARE _st;

SET @i = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND INDEX_NAME = 'idx_plan_expires');
SET @s = IF(@i = 0, 'ALTER TABLE `users` ADD INDEX `idx_plan_expires` (`plan`, `plan_expires_at`)', 'SELECT 1');
PREPARE _st FROM @s; EXECUTE _st; DEALLOCATE PREPARE _st;

SET @i = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND INDEX_NAME = 'idx_active_sub');
SET @s = IF(@i = 0, 'ALTER TABLE `users` ADD INDEX `idx_active_sub` (`active_subscription_id`)', 'SELECT 1');
PREPARE _st FROM @s; EXECUTE _st; DEALLOCATE PREPARE _st;

-- ════════════════════════════════════════════
--  2. subscriptions
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id`                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `user_id`             INT UNSIGNED    NOT NULL,
  `plan_id`             VARCHAR(50)     NOT NULL,
  `payment_method`      VARCHAR(50)     NOT NULL,
  `external_payment_id` VARCHAR(255)    DEFAULT NULL,
  `external_sub_id`     VARCHAR(255)    DEFAULT NULL,
  `period`              ENUM('month','year','custom') NOT NULL DEFAULT 'month',
  `start_at`            DATETIME        NOT NULL,
  `end_at`              DATETIME        DEFAULT NULL,
  `status`              ENUM(
                          'pending','paid','failed','expired',
                          'cancelled','refunded','awaiting_manual_confirmation'
                        ) NOT NULL DEFAULT 'pending',
  `auto_renew`          TINYINT(1)      NOT NULL DEFAULT 0,
  `amount`              DECIMAL(10,2)   DEFAULT NULL,
  `currency`            VARCHAR(3)      NOT NULL DEFAULT 'UAH',
  `notes`               TEXT            DEFAULT NULL,
  `cancelled_at`        DATETIME        DEFAULT NULL,
  `expired_at`          DATETIME        DEFAULT NULL,
  `created_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_status`  (`user_id`, `status`),
  INDEX `idx_end_at`       (`end_at`, `status`),
  INDEX `idx_external_pay` (`external_payment_id`),
  INDEX `idx_external_sub` (`external_sub_id`),
  INDEX `idx_method`       (`payment_method`),
  CONSTRAINT `fk_sub_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ════════════════════════════════════════════
--  3. payments
--     payload: MEDIUMTEXT — сумісно з MySQL 5.6+
--     (JSON підтримується лише з 5.7.8)
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS `payments` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `subscription_id` INT UNSIGNED  NOT NULL,
  `user_id`         INT UNSIGNED  NOT NULL,
  `payment_method`  VARCHAR(50)   NOT NULL,
  `external_id`     VARCHAR(255)  DEFAULT NULL,
  `amount`          DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `currency`        VARCHAR(3)    NOT NULL DEFAULT 'UAH',
  `status`          ENUM('pending','paid','failed','refunded','awaiting_manual_confirmation')
                    NOT NULL DEFAULT 'pending',
  `payload`         MEDIUMTEXT    DEFAULT NULL,
  `error_message`   VARCHAR(500)  DEFAULT NULL,
  `paid_at`         DATETIME      DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_subscription` (`subscription_id`),
  INDEX `idx_user`         (`user_id`),
  INDEX `idx_external`     (`external_id`),
  INDEX `idx_status`       (`status`, `created_at`),
  CONSTRAINT `fk_pay_sub`  FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pay_user` FOREIGN KEY (`user_id`)         REFERENCES `users`(`id`)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ════════════════════════════════════════════
--  4. webhook_logs
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS `webhook_logs` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `provider`     VARCHAR(50)     NOT NULL,
  `event_type`   VARCHAR(100)    DEFAULT NULL,
  `external_id`  VARCHAR(255)    DEFAULT NULL,
  `raw_headers`  TEXT            DEFAULT NULL,
  `raw_body`     MEDIUMTEXT      DEFAULT NULL,
  `status`       ENUM('received','processed','failed','ignored') NOT NULL DEFAULT 'received',
  `error`        VARCHAR(500)    DEFAULT NULL,
  `ip`           VARCHAR(45)     DEFAULT NULL,
  `processed_at` DATETIME        DEFAULT NULL,
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_provider` (`provider`, `event_type`),
  INDEX `idx_status`   (`status`, `created_at`),
  INDEX `idx_created`  (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ════════════════════════════════════════════
--  5. manual_payment_requests
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS `manual_payment_requests` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `subscription_id` INT UNSIGNED  NOT NULL,
  `user_id`         INT UNSIGNED  NOT NULL,
  `user_email`      VARCHAR(255)  NOT NULL,
  `plan_id`         VARCHAR(50)   NOT NULL,
  `period`          ENUM('month','year','custom') NOT NULL DEFAULT 'month',
  `amount`          DECIMAL(10,2) DEFAULT NULL,
  `receipt_path`    VARCHAR(500)  DEFAULT NULL,
  `receipt_url`     VARCHAR(500)  DEFAULT NULL,
  `notes`           TEXT          DEFAULT NULL,
  `admin_notes`     TEXT          DEFAULT NULL,
  `status`          ENUM('pending','confirmed','rejected') NOT NULL DEFAULT 'pending',
  `confirmed_by`    VARCHAR(100)  DEFAULT NULL,
  `confirmed_at`    DATETIME      DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_subscription` (`subscription_id`),
  INDEX `idx_user`         (`user_id`),
  INDEX `idx_status`       (`status`, `created_at`),
  CONSTRAINT `fk_mpr_sub`  FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mpr_user` FOREIGN KEY (`user_id`)         REFERENCES `users`(`id`)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ════════════════════════════════════════════
--  6. FK users.active_subscription_id
-- ════════════════════════════════════════════

SET @fk = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
           WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
             AND CONSTRAINT_NAME = 'fk_user_active_sub' AND CONSTRAINT_TYPE = 'FOREIGN KEY');
SET @s = IF(@fk = 0,
  'ALTER TABLE `users` ADD CONSTRAINT `fk_user_active_sub` FOREIGN KEY (`active_subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE SET NULL',
  'SELECT 1');
PREPARE _st FROM @s; EXECUTE _st; DEALLOCATE PREPARE _st;

SET foreign_key_checks = 1;
