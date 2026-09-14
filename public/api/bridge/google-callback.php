<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

function bridge_fail_login(string $message): never
{
    http_response_code(403);
    header('Content-Type: text/html; charset=UTF-8');
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Staff sign in</title></head><body>';
    echo '<p>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p>';
    echo '<p><a href="/login/">Back to sign in</a></p></body></html>';
    exit;
}

function bridge_http_json(string $url, array $fields): array
{
    $body = http_build_query($fields);
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 20,
        ],
    ]);
    $raw = @file_get_contents($url, false, $context);
    if ($raw === false) {
        throw new RuntimeException('Google did not respond.');
    }
    $parsed = json_decode($raw, true);
    return is_array($parsed) ? $parsed : [];
}

$cfg = bridge_config();
bridge_start_session();
$state = (string) ($_GET['state'] ?? '');
$expected = (string) ($_SESSION['google_oauth_state'] ?? '');
unset($_SESSION['google_oauth_state']);
if ($state === '' || $expected === '' || !hash_equals($expected, $state)) {
    bridge_fail_login('Sign-in expired. Try again.');
}
$code = (string) ($_GET['code'] ?? '');
if ($code === '') {
    bridge_fail_login('Google did not return a sign-in code.');
}

$id = trim((string) ($cfg['google_client_id'] ?? ''));
$secret = trim((string) ($cfg['google_client_secret'] ?? ''));
$origin = rtrim((string) ($cfg['public_origin'] ?? 'https://pfeiferbuild.com'), '/');
try {
    $token = bridge_http_json('https://oauth2.googleapis.com/token', [
        'code' => $code,
        'client_id' => $id,
        'client_secret' => $secret,
        'redirect_uri' => $origin . '/api/bridge/google-callback.php',
        'grant_type' => 'authorization_code',
    ]);
} catch (Throwable) {
    bridge_fail_login('Could not finish Google sign-in.');
}
$access = (string) ($token['access_token'] ?? '');
if ($access === '') {
    bridge_fail_login('Google did not return an access token.');
}

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Authorization: Bearer ' . $access . "\r\n",
        'timeout' => 20,
    ],
]);
$raw = @file_get_contents('https://www.googleapis.com/oauth2/v3/userinfo', false, $context);
$info = is_string($raw) ? json_decode($raw, true) : null;
$email = strtolower(trim((string) ($info['email'] ?? '')));
$verified = ($info['email_verified'] ?? false) === true || ($info['email_verified'] ?? '') === 'true';
if (!$verified || !bridge_staff_email($email)) {
    bridge_fail_login('Admin is only for @' . ($cfg['staff_email_domain'] ?? 'pfeiferbuild.com') . ' Google accounts.');
}

$_SESSION['staff_email'] = $email;
$_SESSION['staff_name'] = (string) ($info['name'] ?? $email);
session_regenerate_id(true);
header('Location: /admin/', true, 302);
exit;
