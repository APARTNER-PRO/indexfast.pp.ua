-- 1. Модифікуємо колонку token на LONGTEXT
-- Це дозволяє зберігати довгі JWT або Google Refresh Tokens
ALTER TABLE tokens MODIFY `token` LONGTEXT NOT NULL;

-- 2. Видаляємо унікальний індекс
-- LONGTEXT не підтримує UNIQUE індекси без вказання довжини префікса.
-- У файлі schema.sql цей індекс називається 'uq_token' (або просто 'token' у деяких версіях).
-- Ми видаляємо його, щоб зміна типу пройшла успішно.
ALTER TABLE tokens DROP INDEX `uq_token`;

-- 3. Додаємо індекс на user_id для оптимізації запитів
ALTER TABLE tokens ADD INDEX `idx_user_id` (`user_id`);
