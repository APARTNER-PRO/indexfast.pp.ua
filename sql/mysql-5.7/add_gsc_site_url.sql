-- Додає Google Search Console resource URL до sites
SET @x1 = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='sites' AND COLUMN_NAME='gsc_url');
SET @s1 = IF(@x1=0,
  'ALTER TABLE sites ADD COLUMN gsc_url VARCHAR(1000) DEFAULT NULL AFTER sitemap_url',
  'SELECT 1');
PREPARE stmt FROM @s1; EXECUTE stmt; DEALLOCATE PREPARE stmt;
