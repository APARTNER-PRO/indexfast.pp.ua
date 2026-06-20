-- sql/indexnow_schema.sql
-- Міграція для додавання підтримки IndexNow в таблицю sites

-- 1. Додаємо поле для унікального ключа верифікації IndexNow
ALTER TABLE sites ADD COLUMN IF NOT EXISTS indexnow_key VARCHAR(64) DEFAULT NULL;

-- 2. Додаємо прапорець (toggle), чи увімкнена відправка в IndexNow для цього сайту
ALTER TABLE sites ADD COLUMN IF NOT EXISTS indexnow_enabled TINYINT(1) NOT NULL DEFAULT 0;

-- 3. (Опціонально) Генеруємо випадкові ключі для вже існуючих сайтів
-- UPDATE sites SET indexnow_key = MD5(RAND()) WHERE indexnow_key IS NULL;
