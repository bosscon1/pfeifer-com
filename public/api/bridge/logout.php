<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';
bridge_start_session();
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'] ?? '/', $p['domain'] ?? '', (bool) $p['secure'], (bool) $p['httponly']);
}
session_destroy();
if (str_contains((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json')) {
    bridge_json(['ok' => true]);
}
header('Location: /login/', true, 302);
exit;
