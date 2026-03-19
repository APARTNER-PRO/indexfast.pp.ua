<?php
// ══════════════════════════════════════════════
//  IndexFast — db.php
//  PDO singleton з оптимізацією для shared хостингу
//  SET SESSION замість my.cnf (не потрібні SUPER права)
// ══════════════════════════════════════════════

require_once __DIR__ . '/config.php';

class DB {
    private static ?PDO $pdo = null;

    // ── Підключення з усіма оптимізаціями через INIT_COMMAND
    public static function connect(): PDO {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            DB_HOST, DB_PORT, DB_NAME
        );

        // Всі SET SESSION в одній команді — один round-trip до БД
        $initCmd = implode('; ', [
            // Кодування
            "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            // Часова зона — UTC скрізь, без плутанини
            "SET time_zone = '+00:00'",
            // SQL mode — строгий режим: ловимо помилки до збереження
            "SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'",
            // З'єднання закривається після 30с простою
            // Shared хостинг обмежує max_connections — звільняємо швидше
            "SET SESSION wait_timeout = 30",
            "SET SESSION interactive_timeout = 30",
            // Temp таблиці в RAM замість диску (для GROUP BY, ORDER BY на великих наборах)
            // Shared хостинг зазвичай дозволяє до 64M
            "SET SESSION tmp_table_size = 33554432",                 // 32MB
            "SET SESSION max_heap_table_size = 33554432",            // 32MB
            // Буфери сортування і JOIN (виділяються per-query)
            "SET SESSION sort_buffer_size = 2097152",                // 2MB
            "SET SESSION join_buffer_size = 2097152",                // 2MB
            // Для GROUP_CONCAT в запитах статистики
            "SET SESSION group_concat_max_len = 65536",
        ]);

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,   // реальний prepared statements
                PDO::ATTR_PERSISTENT         => false,   // persistent на shared = проблеми
                PDO::MYSQL_ATTR_INIT_COMMAND => $initCmd,
                // Стиснення протоколу MySQL — менше трафіку між PHP і БД
                // (корисно якщо PHP і MySQL на різних серверах)
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
        if (self::$pdo === null) {
            self::$pdo = self::connect();
        }
        return self::$pdo;
    }

    // ── Shortcut: всі рядки
    public static function all(string $sql, array $params = []): array {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    // ── Shortcut: один рядок
    public static function row(string $sql, array $params = []): ?array {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    // ── Shortcut: одне значення
    public static function value(string $sql, array $params = []): mixed {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return $val !== false ? $val : null;
    }

    // ── Shortcut: INSERT/UPDATE/DELETE
    //    INSERT → lastInsertId
    //    UPDATE/DELETE → rowCount
    public static function exec(string $sql, array $params = []): int {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        $id = self::pdo()->lastInsertId();
        return $id ? (int)$id : $stmt->rowCount();
    }

    // ── Транзакція з автоматичним rollback при помилці
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
