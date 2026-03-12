<?php
// ══════════════════════════════════════════════
//  IndexFast — db.php
//  PDO singleton. Використовуй: DB::get()
// ══════════════════════════════════════════════

require_once __DIR__ . '/config.php';

class DB {
    private static ?PDO $instance = null;

    public static function get(): PDO {
        if (self::$instance === null) {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
            );
            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
                ]);
            } catch (PDOException $e) {
                // Не виводимо деталі підключення у відповідь
                error_log('[DB] Connection failed: ' . $e->getMessage());
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Database connection error']);
                exit;
            }
        }
        return self::$instance;
    }

    // Shortcut: виконати запит і повернути всі рядки
    public static function query(string $sql, array $params = []): array {
        $stmt = self::get()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    // Shortcut: один рядок
    public static function row(string $sql, array $params = []): ?array {
        $stmt = self::get()->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    // Shortcut: одне значення
    public static function value(string $sql, array $params = []): mixed {
        $stmt = self::get()->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return $val !== false ? $val : null;
    }

    // Shortcut: INSERT/UPDATE/DELETE — повертає lastInsertId або rowCount
    public static function exec(string $sql, array $params = []): string|int {
        $stmt = self::get()->prepare($sql);
        $stmt->execute($params);
        $id = self::get()->lastInsertId();
        return $id ?: $stmt->rowCount();
    }
}
