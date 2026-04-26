-- ── Додає поля GSC токена в users
SET @x1 = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='users' AND COLUMN_NAME='gsc_access_token');
SET @s1 = IF(@x1=0,
  'ALTER TABLE users ADD COLUMN gsc_access_token TEXT DEFAULT NULL AFTER marketing_consent',
  'SELECT 1');
PREPARE stmt FROM @s1; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @x2 = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='users' AND COLUMN_NAME='gsc_token_expires');
SET @s2 = IF(@x2=0,
  'ALTER TABLE users ADD COLUMN gsc_token_expires DATETIME DEFAULT NULL AFTER gsc_access_token',
  'SELECT 1');
PREPARE stmt FROM @s2; EXECUTE stmt; DEALLOCATE PREPARE stmt;
