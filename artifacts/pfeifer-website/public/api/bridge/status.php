<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

$cfg = bridge_config();
$configFile = is_file(__DIR__ . '/config.php');
$password = strtolower(trim((string) ($cfg['mysql_password'] ?? '')));
$passwordSet = $password !== '' && $password !== 'change_me' && $password !== 'changeme';
$google = trim((string) ($cfg['google_client_id'] ?? '')) !== ''
    && trim((string) ($cfg['google_client_secret'] ?? '')) !== '';

$mysql = false;
$mysqlError = null;
$table = false;
try {
    $db = bridge_db();
    $mysql = (bool) $db->query('select 1');
    $check = $db->query("show tables like 'gallery_settings'");
    $table = $check instanceof mysqli_result && $check->num_rows > 0;
    $db->close();
} catch (Throwable $e) {
    $mysql = false;
    $mysqlError = 'Could not connect to MySQL on localhost. Check the user, password, and database name in config.php.';
}

$ready = $configFile && $passwordSet && $mysql && $google;
$user = bridge_user();
bridge_json([
    'ok' => $ready,
    'php' => true,
    'config_file' => $configFile,
    'password_set' => $passwordSet,
    'mysql' => $mysql,
    'mysql_error' => $mysqlError,
    'table' => $table,
    'google' => $google,
    'ready' => $ready,
    'user' => $user,
]);
