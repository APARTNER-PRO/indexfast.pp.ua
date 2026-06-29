-- Додаємо колонку `lang` для збереження мови користувача
-- MySQL 8.0+ (також працює на 5.7+ з MODIFY COLUMN)

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS lang VARCHAR(10) NOT NULL DEFAULT 'uk'
  AFTER marketing_consent;
