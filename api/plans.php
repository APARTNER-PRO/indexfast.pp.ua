<?php
// ══════════════════════════════════════════════
//  Plans — конфіг пакетів і денний ліміт
// ══════════════════════════════════════════════
class Plans {

    const CONFIG = [
        'start'  => ['label' => 'Старт',   'urls_per_day' => 20,    'max_sites' => 1],
        'pro'    => ['label' => 'PRO',     'urls_per_day' => 100,   'max_sites' => 10],
        'agency' => ['label' => 'Агенція', 'urls_per_day' => 99999, 'max_sites' => 9999],
    ];

    public static function get(string $plan): array {
        return self::CONFIG[$plan] ?? self::CONFIG['start'];
    }

    // ── Пріоритет job у черзі: менше = вищий пріоритет
    public static function jobPriority(string $plan): int {
        return match($plan) {
            'agency' => 1,
            'pro'    => 3,
            default  => 5,   // start
        };
    }

    // ── Отримати або створити рядок daily_usage на сьогодні
    public static function todayUsage(int $userId, string $plan): array {
        $today = date('Y-m-d');
        $limit = self::CONFIG[$plan]['urls_per_day'] ?? 20;

        // Атомарний upsert: якщо рядку немає — створюємо
        DB::exec(
            "INSERT INTO daily_usage (user_id, usage_date, urls_sent, urls_limit)
             VALUES (?,?,0,?)
             ON DUPLICATE KEY UPDATE
               urls_limit = IF(urls_limit != VALUES(urls_limit), VALUES(urls_limit), urls_limit)",
            [$userId, $today, $limit]
        );

        return DB::row(
            "SELECT * FROM daily_usage WHERE user_id=? AND usage_date=?",
            [$userId, $today]
        );
    }

    // ── Скільки URL залишилось сьогодні
    public static function remaining(int $userId, string $plan): int {
        $u = self::todayUsage($userId, $plan);
        return max(0, (int)$u['urls_limit'] - (int)$u['urls_sent']);
    }

    // ── Атомарно резервуємо ліміт при постановці в чергу
    //    Захист від race condition: два паралельних запити не перевищать ліміт
    public static function reserve(int $userId, int $count): bool {
        $today = date('Y-m-d');
        // UPDATE тільки якщо вистачає ліміту
        $affected = DB::exec(
            "UPDATE daily_usage
             SET urls_sent = urls_sent + ?
             WHERE user_id=? AND usage_date=?
               AND (urls_sent + ?) <= urls_limit",
            [$count, $userId, $today, $count]
        );
        return $affected > 0;
    }

    // ── Звільняємо зарезервований ліміт (якщо job скасовано/помилка до відправки)
    public static function release(int $userId, int $count): void {
        $today = date('Y-m-d');
        DB::exec(
            "UPDATE daily_usage
             SET urls_sent = GREATEST(0, urls_sent - ?)
             WHERE user_id=? AND usage_date=?",
            [$count, $userId, $today]
        );
    }

    // ── Збільшити лічильник (викликає воркер після фактичної відправки)
    //    Оскільки reserve() вже зарахував — тут нічого не змінюємо
    //    Метод залишаємо для сумісності / можливих майбутніх сценаріїв
    public static function increment(int $userId, int $count): void {
        // Ліміт вже зарезервований в reserve()
        // Тут можна додати аналітику або сповіщення
    }

    // ── Графік за 30 днів
    public static function chart(int $userId): array {
        return DB::all(
            "SELECT usage_date AS date, urls_sent AS sent
             FROM daily_usage
             WHERE user_id=? AND usage_date >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
             ORDER BY usage_date ASC",
            [$userId]
        );
    }
}
