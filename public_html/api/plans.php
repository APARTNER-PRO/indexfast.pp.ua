<?php
// public_html/api/plans.php
// ══════════════════════════════════════════════
//  Plans — конфіг пакетів і денний ліміт
// ══════════════════════════════════════════════
if (!class_exists('Plans')) {
    class Plans
    {
        public const CONFIG = [
            'start' => [
                'label'       => 'Старт',
                'urls_per_day'=> 10,
                'max_sites'   => 1,
                'limits'      => ['sites' => 1, 'pages' => 10],
                'popular'     => false,
                'enterprise'  => false,
                'features'    => [
                    '10 URL/день',
                    '1 сайт',
                    'Sitemap Index підтримка',
                    'Базова підтримка',
                    'Стандартна швидкість',
                ],
            ],
            'pro' => [
                'label'       => 'PRO',
                'urls_per_day'=> 100,
                'max_sites'   => 5,
                'limits'      => ['sites' => 5, 'pages' => 100],
                'popular'     => true,
                'enterprise'  => false,
                'features'    => [
                    '100 URL/день',
                    'До 5 сайтів',
                    'Швидша індексація та обробка',
                    'Розклад індексації',
                    'Лог індексації',
                ],
            ],
            'agency' => [
                'label'       => 'Агенція',
                'urls_per_day'=> 1000,
                'max_sites'   => 50,
                'limits'      => ['sites' => 50, 'pages' => 1000],
                'popular'     => false,
                'enterprise'  => false,
                'features'    => [
                    '1 000 URL/день',
                    'До 50 сайтів',
                    'Web + Webhooks',
                    'White-label звіти',
                    'Авто-запуск за розкладом',
                    'Повний API доступ',
                    'Пріоритетна підтримка 24/7',
                ],
            ],
            'enterprise' => [
                'label'       => 'Enterprise',
                'urls_per_day'=> 99999,
                'max_sites'   => 9999,
                'limits'      => ['sites' => -1, 'pages' => -1],
                'popular'     => false,
                'enterprise'  => true,
                'features'    => [
                    'Необмежено URL/день',
                    'Необмежено сайтів',
                    'Кілька Service Account',
                    'Виділений воркер',
                    'Інтеграція під ключ',
                    'SLA та гарантії uptime',
                    'Персональний менеджер',
                ],
            ],
        ];

        public static function get(string $planId): array
        {
            return isset(self::CONFIG[$planId]) ? self::CONFIG[$planId] : self::CONFIG['start'];
        }

        public static function label(string $planId): string
        {
            return isset(self::CONFIG[$planId]['label'])
                ? self::CONFIG[$planId]['label']
                : strtoupper($planId);
        }

        public static function exists(string $planId): bool
        {
            return isset(self::CONFIG[$planId]);
        }

        // ── Пріоритет job у черзі: менше = вищий пріоритет
        public static function jobPriority(string $plan): int {
            return match($plan) {
                'enterprise' => 0,   // найвищий пріоритет
                'agency'     => 1,
                'pro'        => 3,
                default      => 5,   // start
            };
        }

        // ── Отримати або створити рядок daily_usage на сьогодні
        public static function todayUsage(int $userId, string $plan): array {
            $today = date('Y-m-d');
            $limit = self::CONFIG[$plan]['urls_per_day'] ?? 100;

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
        public static function reserve(int $userId, int $count): bool {
            $today = date('Y-m-d');
            $affected = DB::exec(
                "UPDATE daily_usage
                 SET urls_sent = urls_sent + ?
                 WHERE user_id=? AND usage_date=?
                   AND (urls_sent + ?) <= urls_limit",
                [$count, $userId, $today, $count]
            );
            return $affected > 0;
        }

        public static function release(int $userId, int $count): void {
            $today = date('Y-m-d');
            DB::exec(
                "UPDATE daily_usage
                 SET urls_sent = GREATEST(0, urls_sent - ?)
                 WHERE user_id=? AND usage_date=?",
                [$count, $userId, $today]
            );
        }

        public static function increment(int $userId, int $count): void {
            // Ліміт вже зарезервований в reserve()
        }

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
}
