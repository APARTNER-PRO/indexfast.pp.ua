-- ── Додає тип unsubscribe в таблицю tokens
ALTER TABLE `tokens`
  MODIFY COLUMN `type`
    ENUM('email_verify','password_reset','refresh','unsubscribe')
    NOT NULL;
