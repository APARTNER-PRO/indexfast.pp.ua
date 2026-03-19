<?php
// ══════════════════════════════════════════════
//  IndexFast — db_check.php
//  Запустити ОДИН РАЗ після деплою:
//  https://indexfast.pp.ua/api/db_check.php?token=YOUR_SECRET
//
//  Показує поточні параметри MySQL і дає рекомендації
//  ВИДАЛИТИ або закрити після перевірки!
// ══════════════════════════════════════════════

// Захист від публічного доступу
$secret = $_GET['token'] ?? '';
if ($secret !== (defined('DB_CHECK_TOKEN') ? DB_CHECK_TOKEN : getenv('DB_CHECK_TOKEN'))) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════\n";
echo " IndexFast — MySQL Diagnostics\n";
echo " " . date('Y-m-d H:i:s') . "\n";
echo "═══════════════════════════════════════\n\n";

// ── Версія MySQL
$ver = DB::value("SELECT VERSION()");
echo "MySQL Version: {$ver}\n\n";

// ── Привілеї поточного юзера
echo "── Привілеї:\n";
$grants = DB::all("SHOW GRANTS FOR CURRENT_USER()");
foreach ($grants as $row) {
    echo "  " . array_values($row)[0] . "\n";
}
echo "\n";

// ── Ключові параметри
$params = [
    // Пам'ять
    'innodb_buffer_pool_size'     => ['target' => 128 * 1024 * 1024, 'unit' => 'MB', 'div' => 1024*1024, 'note' => 'Головний кеш InnoDB. Чим більше — тим краще.'],
    'innodb_buffer_pool_instances'=> ['target' => 1, 'unit' => '',   'div' => 1,     'note' => 'Кількість instances buffer pool.'],
    'innodb_log_buffer_size'      => ['target' => 16*1024*1024, 'unit' => 'MB', 'div' => 1024*1024, 'note' => 'Буфер redo log.'],
    'tmp_table_size'              => ['target' => 32*1024*1024, 'unit' => 'MB', 'div' => 1024*1024, 'note' => 'Temp таблиці в RAM. Менше → диск → повільно.'],
    'max_heap_table_size'         => ['target' => 32*1024*1024, 'unit' => 'MB', 'div' => 1024*1024, 'note' => 'Максимум для MEMORY таблиць.'],
    'sort_buffer_size'            => ['target' => 2*1024*1024,  'unit' => 'MB', 'div' => 1024*1024, 'note' => 'Буфер сортування per-query.'],
    'join_buffer_size'            => ['target' => 2*1024*1024,  'unit' => 'MB', 'div' => 1024*1024, 'note' => 'Буфер JOIN per-query.'],
    // З'єднання
    'max_connections'             => ['target' => 50,  'unit' => '',  'div' => 1, 'note' => 'Ліміт з\'єднань. Shared хостинг: зазвичай 20-100.'],
    'wait_timeout'                => ['target' => 30,  'unit' => 'с', 'div' => 1, 'note' => 'Закриває idle з\'єднання. Менше = швидше звільнення.'],
    'interactive_timeout'         => ['target' => 30,  'unit' => 'с', 'div' => 1, 'note' => 'Те саме для інтерактивних.'],
    'max_allowed_packet'          => ['target' => 64*1024*1024, 'unit' => 'MB', 'div' => 1024*1024, 'note' => 'Максимальний розмір запиту. Потрібно ≥16MB для credentials.'],
    // InnoDB
    'innodb_flush_log_at_trx_commit' => ['target' => 2, 'unit' => '', 'div' => 1, 'note' => '1=надійно/повільно, 2=швидше/трохи ризик при краші.'],
    'innodb_file_per_table'       => ['target' => 'ON', 'unit' => '', 'div' => 1, 'note' => 'Окремий файл на таблицю. Має бути ON.'],
    // Query cache (MySQL 5.7, застарів у 8.0)
    'query_cache_type'            => ['target' => 0, 'unit' => '', 'div' => 1, 'note' => 'Query cache — вимкнути (викликає mutex contention).'],
    // SQL mode
    'sql_mode'                    => ['target' => 'STRICT', 'unit' => '', 'div' => 1, 'note' => 'Має включати STRICT_TRANS_TABLES.'],
    'time_zone'                   => ['target' => '+00:00', 'unit' => '', 'div' => 1, 'note' => 'Має бути UTC (+00:00).'],
    'character_set_server'        => ['target' => 'utf8mb4', 'unit' => '', 'div' => 1, 'note' => 'Кодування. Має бути utf8mb4.'],
];

echo "── Параметри MySQL:\n";
echo str_pad('Параметр', 40) . str_pad('Значення', 15) . str_pad('Статус', 10) . "Примітка\n";
echo str_repeat('─', 100) . "\n";

$warnings = [];
foreach ($params as $name => $info) {
    $row = DB::row("SHOW SESSION VARIABLES LIKE ?", [$name]);
    if (!$row) {
        echo str_pad($name, 40) . str_pad('н/д', 15) . str_pad('⚠ skip', 10) . "\n";
        continue;
    }
    $raw = $row['Value'];
    $display = ($info['div'] > 1 && is_numeric($raw))
        ? round($raw / $info['div'], 1) . $info['unit']
        : $raw . $info['unit'];

    // Перевірка відповідності
    $ok = true;
    if ($info['target'] === 'STRICT') {
        $ok = str_contains($raw, 'STRICT_TRANS_TABLES');
    } elseif ($info['target'] === '+00:00') {
        $ok = in_array($raw, ['+00:00', 'UTC', 'Etc/UTC'], true);
    } elseif (is_numeric($info['target']) && is_numeric($raw)) {
        $ok = (float)$raw >= (float)$info['target'];
    } elseif (is_string($info['target'])) {
        $ok = strtolower($raw) === strtolower($info['target']);
    }

    $status = $ok ? '✓ OK' : '✗ LOW';
    if (!$ok) $warnings[] = "  {$name} = {$display} (рекомендовано: {$info['target']}{$info['unit']}) — {$info['note']}";

    echo str_pad($name, 40) . str_pad($display, 15) . str_pad($status, 10) . $info['note'] . "\n";
}

// ── SET SESSION — перевіряємо що наш INIT_COMMAND спрацював
echo "\n── Перевірка SET SESSION з db.php INIT_COMMAND:\n";
$sessionChecks = [
    ['SET SESSION tmp_table_size = 33554432', 'tmp_table_size', 33554432],
    ['SET SESSION sort_buffer_size = 2097152', 'sort_buffer_size', 2097152],
];
foreach ($sessionChecks as [$cmd, $var, $expected]) {
    try {
        DB::exec($cmd);
        $val = DB::value("SELECT @@SESSION.{$var}");
        $ok  = (int)$val >= $expected;
        echo "  " . ($ok ? "✓" : "✗") . " {$var} = " . number_format($val) . "\n";
        if (!$ok) $warnings[] = "  {$var}: SET SESSION не підтримується хостингом (тільки читання)";
    } catch (Throwable $e) {
        echo "  ✗ {$var}: {$e->getMessage()}\n";
        $warnings[] = "  {$var}: SET SESSION заборонено — {$e->getMessage()}";
    }
}

// ── Таблиці і індекси
echo "\n── Таблиці БД:\n";
$tables = DB::all(
    "SELECT
       TABLE_NAME                          AS name,
       TABLE_ROWS                          AS rows_approx,
       ROUND(DATA_LENGTH/1024/1024, 2)    AS data_mb,
       ROUND(INDEX_LENGTH/1024/1024, 2)   AS index_mb,
       ENGINE,
       TABLE_COLLATION
     FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
     ORDER BY DATA_LENGTH DESC"
);
echo str_pad('Таблиця', 25) . str_pad('Рядків~', 12) . str_pad('Дані MB', 10) . str_pad('Індекс MB', 12) . str_pad('Engine', 10) . "Collation\n";
echo str_repeat('─', 85) . "\n";
foreach ($tables as $t) {
    $warnEngine = $t['ENGINE'] !== 'InnoDB' ? ' ← УВАГА: не InnoDB!' : '';
    echo str_pad($t['name'], 25)
       . str_pad($t['rows_approx'] ?? '?', 12)
       . str_pad($t['data_mb'] ?? '0', 10)
       . str_pad($t['index_mb'] ?? '0', 12)
       . str_pad($t['ENGINE'], 10)
       . $t['TABLE_COLLATION']
       . $warnEngine . "\n";
}

// ── Зведення попереджень
if ($warnings) {
    echo "\n── ⚠ Попередження / Рекомендації:\n";
    foreach ($warnings as $w) echo $w . "\n";
    echo "\nЯкщо хостинг забороняє SET SESSION — зверніться до підтримки\n";
    echo "або перейдіть на VPS для повного контролю.\n";
} else {
    echo "\n✓ Всі параметри в нормі.\n";
}

echo "\n═══════════════════════════════════════\n";
echo "УВАГА: Видаліть або заблокуйте цей файл після перевірки!\n";
echo "═══════════════════════════════════════\n";
