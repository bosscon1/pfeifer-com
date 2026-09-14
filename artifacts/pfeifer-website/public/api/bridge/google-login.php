<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

$cfg = bridge_config();
$id = trim((string) ($cfg['google_client_id'] ?? ''));
$secret = trim((string) ($cfg['google_client_secret'] ?? ''));
$origin = rtrim((string) ($cfg['public_origin'] ?? ''), '/');
if ($id === '' || $secret === '' || $origin === '' || str_contains($origin, 'example.invalid')) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=UTF-8');
    echo "Google sign-in is not configured. Copy config.sample.php to config.php and add the Google client ID and secret.";
    exit;
}

bridge_start_session();
$state = bin2hex(random_bytes(16));
$_SESSION['google_oauth_state'] = $state;
$redirect = $origin . '/api/bridge/google-callback.php';
$query = http_build_query([
    'client_id' => $id,
    'redirect_uri' => $redirect,
    'response_type' => 'code',
    'scope' => 'openid email profile',
    'state' => $state,
    'prompt' => 'select_account',
    'hd' => (string) ($cfg['staff_email_domain'] ?? 'pfeiferbuild.com'),
]);
header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . $query, true, 302);
exit;
