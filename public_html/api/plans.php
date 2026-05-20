<?php
// public_html/api/plans.php
// Якщо Plans вже є — переконайся що є константа CONFIG з полем 'label'
if (!class_exists('Plans')) {
    class Plans
    {
        public static $CONFIG = [
            'start'      => ['label' => 'Старт',      'limits' => ['sites' => 3,   'pages' => 100]],
            'pro'        => ['label' => 'PRO',         'limits' => ['sites' => 20,  'pages' => 5000]],
            'agency'     => ['label' => 'Агенція',     'limits' => ['sites' => 100, 'pages' => 50000]],
            'enterprise' => ['label' => 'Enterprise',  'limits' => ['sites' => -1,  'pages' => -1]],
        ];

        // PHP 7.4 не може звертатись до self::CONFIG як константи масиву через define()
        // Використовуємо статичну властивість $CONFIG
        public static function get(string $planId): ?array
        {
            return isset(self::$CONFIG[$planId]) ? self::$CONFIG[$planId] : null;
        }

        public static function label(string $planId): string
        {
            return isset(self::$CONFIG[$planId]['label'])
                ? self::$CONFIG[$planId]['label']
                : strtoupper($planId);
        }

        public static function exists(string $planId): bool
        {
            return isset(self::$CONFIG[$planId]);
        }
    }
}
