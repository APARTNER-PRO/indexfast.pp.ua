-- ── Додає marketing_consent для існуючих БД
SET @col_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'marketing_consent'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN marketing_consent TINYINT(1) NOT NULL DEFAULT 0 AFTER is_active;',
    'SELECT "Column already exists";'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;