<?php
// ══════════════════════════════════════════════
//  db_worker.php — DB для worker (без HTTP exit)
//  Підключається замість api/db.php
// ══════════════════════════════════════════════
require_once __DIR__ . '/../api/config.php';

class DB {
    private static ?PDO $pdo = null;

    public static function connect(): PDO {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            DB_HOST, DB_PORT, DB_NAME
        );

        $initCmd = implode('; ', [
            "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            "SET time_zone = '+00:00'",
            "SET SESSION wait_timeout = 3600",
            "SET SESSION sort_buffer_size = 2097152",
        ]);

        try {
            return new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::ATTR_PERSISTENT         => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => $initCmd,
            ]);
        } catch (PDOException $e) {
            // Worker: пишемо в stderr і виходимо з кодом помилки
            fwrite(STDERR, '[DB] Connection failed: ' . $e->getMessage() . PHP_EOL);
            exit(1);
        }
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
