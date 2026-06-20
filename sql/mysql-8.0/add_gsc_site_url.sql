-- Додає Google Search Console resource URL до sites
ALTER TABLE `sites`
  ADD COLUMN IF NOT EXISTS `gsc_url` VARCHAR(1000) DEFAULT NULL AFTER `sitemap_url`;
