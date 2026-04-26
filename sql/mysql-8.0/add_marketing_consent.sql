-- ── Додає marketing_consent для існуючих БД
ALTER TABLE users ADD COLUMN IF NOT EXISTS
  marketing_consent TINYINT(1) NOT NULL DEFAULT 0
  AFTER is_active;
