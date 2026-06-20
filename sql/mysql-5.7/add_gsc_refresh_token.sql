-- Додає GSC refresh token для автоматичного оновлення access token
SET @x1 = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='users' AND COLUMN_NAME='gsc_refresh_token');
SET @s1 = IF(@x1=0,
  'ALTER TABLE users ADD COLUMN gsc_refresh_token TEXT DEFAULT NULL AFTER gsc_access_token',
  'SELECT 1');
PREPARE stmt FROM @s1; EXECUTE stmt; DEALLOCATE PREPARE stmt;
