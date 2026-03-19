<?php
// ══════════════════════════════════════════════
//  IndexFast — db_fallback.php
//  Якщо shared хостинг ЗАБОРОНЯЄ SET SESSION —
//  підключити замість db.php
//  (без session оптимізацій, тільки базові)
// ══════════════════════════════════════════════

require_once __DIR__ . '/config.php';

class DB {
    private static ?PDO $pdo = null;

    public static function connect(): PDO {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            DB_HOST, DB_PORT, DB_NAME
        );

        // Мінімальний INIT_COMMAND — тільки те що точно дозволено скрізь
        $initCmd = implode('; ', [
            "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            "SET time_zone = '+00:00'",
        ]);

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::ATTR_PERSISTENT         => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => $initCmd,
                PDO::MYSQL_ATTR_COMPRESS     => true,
            ]);
        } catch (PDOException $e) {
            error_log('[DB] Connection failed: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database connection error']);
            exit;
        }

        return $pdo;
    }

    public static function pdo(): PDO {
        if (self::$pdo === null) self::$pdo = self::connect();
        return self::$pdo;
    }

    public static function all(string $sql, array $params = []): array {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function row(string $sql, array $params = []): ?array {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch() ?: null;
    }

    public static function value(string $sql, array $params = []): mixed {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return $val !== false ? $val : null;
    }

    public static function exec(string $sql, array $params = []): int {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        $id = self::pdo()->lastInsertId();
        return $id ? (int)$id : $stmt->rowCount();
    }

    public static function transaction(callable $fn): mixed {
        $pdo = self::pdo();
        $pdo->beginTransaction();
        try {
            $result = $fn($pdo);
            $pdo->commit();
            return $result;
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}
