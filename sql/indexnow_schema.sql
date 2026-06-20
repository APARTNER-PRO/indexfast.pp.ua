-- sql/indexnow_schema.sql
-- Міграція для додавання підтримки IndexNow в таблицю sites

-- 1. Додаємо поле для унікального ключа верифікації IndexNow
ALTER TABLE sites ADD COLUMN IF NOT EXISTS indexnow_key VARCHAR(64) DEFAULT NULL;

-- 2. Додаємо прапорець (toggle), чи увімкнена відправка в IndexNow для цього сайту
ALTER TABLE sites ADD COLUMN IF NOT EXISTS indexnow_enabled TINYINT(1) NOT NULL DEFAULT 0;

-- 2. За замовчуванням вимкнено для всіх (потрібно вмикати вручну)
-- Для вже існуючих сайтів можна включити (опціонально)
-- UPDATE sites SET indexnow_enabled = 1;

-- 3. Додаємо колонки для логування статусу IndexNow
ALTER TABLE indexing_log
ADD COLUMN indexnow_status VARCHAR(20) DEFAULT NULL AFTER error_msg,
ADD COLUMN indexnow_http_status INT DEFAULT NULL AFTER indexnow_status;

-- 4. (Опціонально) Генеруємо випадкові ключі для вже існуючих сайтів
-- UPDATE sites SET indexnow_key = MD5(RAND()) WHERE indexnow_key IS NULL;
