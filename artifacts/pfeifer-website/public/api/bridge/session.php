<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';
$user = bridge_user();
if (!$user) {
    bridge_json(['ok' => false, 'user' => null], 401);
}
bridge_json(['ok' => true, 'user' => $user, 'csrf' => bridge_csrf_token()]);
