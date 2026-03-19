-- ══════════════════════════════════════════════
--  IndexFast — Database Schema
--  MySQL 8.0+ / MariaDB 10.5+
-- ══════════════════════════════════════════════

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ── Користувачі
CREATE TABLE IF NOT EXISTS `users` (
  `id`             INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `email`          VARCHAR(255)     NOT NULL,
  `password_hash`  VARCHAR(255)     DEFAULT NULL,        -- NULL якщо тільки Google OAuth
  `name`           VARCHAR(100)     NOT NULL DEFAULT '',
  `surname`        VARCHAR(100)     NOT NULL DEFAULT '',
  `avatar_url`     VARCHAR(500)     DEFAULT NULL,

  -- Google OAuth
  `google_id`      VARCHAR(100)     DEFAULT NULL,
  `google_email`   VARCHAR(255)     DEFAULT NULL,

  -- Статус
  `email_verified` TINYINT(1)       NOT NULL DEFAULT 0,
  `is_active`      TINYINT(1)       NOT NULL DEFAULT 1,
  `plan`           ENUM('free','pro','agency') NOT NULL DEFAULT 'free',

  -- Timestamps
  `created_at`     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login_at`  DATETIME         DEFAULT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email`     (`email`),
  UNIQUE KEY `uq_google_id` (`google_id`),
  INDEX `idx_email_verified` (`email_verified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── Токени (email verify, password reset, refresh)
CREATE TABLE IF NOT EXISTS `tokens` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`     INT UNSIGNED  NOT NULL,
  `token`       VARCHAR(128)  NOT NULL,
  `type`        ENUM('email_verify','password_reset','refresh') NOT NULL,
  `expires_at`  DATETIME      NOT NULL,
  `used_at`     DATETIME      DEFAULT NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_token` (`token`),
  INDEX `idx_user_type`  (`user_id`, `type`),
  INDEX `idx_expires`    (`expires_at`),
  CONSTRAINT `fk_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── Rate limiting (захист від брутфорсу)
CREATE TABLE IF NOT EXISTS `rate_limits` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `ip`          VARCHAR(45)   NOT NULL,
  `action`      VARCHAR(50)   NOT NULL,   -- 'login', 'register', 'forgot'
  `attempts`    SMALLINT      NOT NULL DEFAULT 1,
  `blocked_until` DATETIME    DEFAULT NULL,
  `last_attempt`  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ip_action` (`ip`, `action`),
  INDEX `idx_blocked` (`blocked_until`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ── Сесії (якщо не використовуємо JWT-only)
CREATE TABLE IF NOT EXISTS `sessions` (
  `id`          VARCHAR(128)  NOT NULL,
  `user_id`     INT UNSIGNED  NOT NULL,
  `ip`          VARCHAR(45)   DEFAULT NULL,
  `user_agent`  VARCHAR(500)  DEFAULT NULL,
  `payload`     JSON          DEFAULT NULL,
  `last_active` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at`  DATETIME      NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `idx_user_id`  (`user_id`),
  INDEX `idx_expires`  (`expires_at`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
