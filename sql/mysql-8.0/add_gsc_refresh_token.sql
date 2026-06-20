-- Додає GSC refresh token для автоматичного оновлення access token
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `gsc_refresh_token` TEXT DEFAULT NULL AFTER `gsc_access_token`;
