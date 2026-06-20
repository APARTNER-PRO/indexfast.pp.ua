<?php
$t = microtime(true);
require 'public_html/api/db.php';
require 'public_html/api/gsc/helpers.php';
$data = gscMetricsForSites(1, [6, 7, 8], 30);
echo "Time 1: " . (microtime(true) - $t) . "s\n";

$t = microtime(true);
$data2 = gscMetricsForSites(1, [6, 7, 8], 30);
echo "Time 2: " . (microtime(true) - $t) . "s\n";
