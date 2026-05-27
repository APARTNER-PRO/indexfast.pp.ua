<?php
require_once __DIR__ . '/public_html/api/config.php';
require_once __DIR__ . '/public_html/api/db.php';
try {
    $tables = DB::all("SHOW TABLES");
    print_r($tables);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
