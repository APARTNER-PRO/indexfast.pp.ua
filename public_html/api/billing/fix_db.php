<?php
// public_html/api/billing/fix_db.php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

try {
    // Змінюємо ENUM щоб він підтримував '3_years'
    DB::exec("ALTER TABLE subscriptions MODIFY COLUMN period ENUM('month','year','3_years','custom') NOT NULL DEFAULT 'month'");
    
    // Те саме для таблиці payments, якщо вона використовує period
    // DB::exec("ALTER TABLE payments MODIFY COLUMN period ENUM('month','year','3_years','custom') NOT NULL DEFAULT 'month'");
    
    echo "<h1>Готово!</h1><p>Базу даних оновлено. Тепер можна купувати тариф на 3 роки.</p>";
} catch (Exception $e) {
    echo "<h1>Помилка</h1><p>" . htmlspecialchars($e->getMessage()) . "</p>";
}
