-- Додаємо колонку `lang` для збереження мови користувача
-- MySQL 5.7

ALTER TABLE users
  ADD COLUMN lang VARCHAR(10) NOT NULL DEFAULT 'uk'
  AFTER marketing_consent;
