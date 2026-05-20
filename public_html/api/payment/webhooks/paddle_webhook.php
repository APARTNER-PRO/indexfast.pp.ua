<?php
require_once dirname(__DIR__, 2) . '/config.php';
require_once dirname(__DIR__, 2) . '/db.php';
require_once dirname(__DIR__) . '/WebhookHandler.php';
header('Content-Type: application/json');
(new WebhookHandler())->handle('paddle');
