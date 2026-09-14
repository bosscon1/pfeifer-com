<?php
declare(strict_types=1);

function bridge_config(): array
{
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        $path = __DIR__ . '/config.sample.php';
    }
    $cfg = require $path;
    return is_array($cfg) ? $cfg : [];
}

function bridge_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_set_cookie_params([
        'lifetime' => 60 * 60 * 24,
        'path' => '/',
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_name('pfeifer_admin');
    session_start();
}

function bridge_json(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function bridge_staff_email(?string $email): bool
{
    $cfg = bridge_config();
    $domain = strtolower((string) ($cfg['staff_email_domain'] ?? 'pfeiferbuild.com'));
    $email = strtolower(trim((string) $email));
    $at = strrpos($email, '@');
    if ($at === false) {
        return false;
    }
    return substr($email, $at + 1) === $domain;
}

function bridge_user(): ?array
{
    bridge_start_session();
    $email = $_SESSION['staff_email'] ?? null;
    if (!bridge_staff_email(is_string($email) ? $email : null)) {
        return null;
    }
    return [
        'email' => strtolower((string) $email),
        'name' => (string) ($_SESSION['staff_name'] ?? ''),
    ];
}

function bridge_require_user(): array
{
    $user = bridge_user();
    if (!$user) {
        bridge_json(['ok' => false, 'error' => 'Sign in required.'], 401);
    }
    return $user;
}

function bridge_db(): mysqli
{
    $cfg = bridge_config();
    $db = mysqli_init();
    if (!$db) {
        throw new RuntimeException('Could not start MySQL.');
    }
    $ok = @$db->real_connect(
        (string) ($cfg['mysql_host'] ?? 'localhost'),
        (string) ($cfg['mysql_user'] ?? ''),
        (string) ($cfg['mysql_password'] ?? ''),
        (string) ($cfg['mysql_database'] ?? ''),
        (int) ($cfg['mysql_port'] ?? 3306),
    );
    if (!$ok) {
        throw new RuntimeException('Could not reach MySQL.');
    }
    $db->set_charset('utf8mb4');
    $db->query(
        'create table if not exists gallery_settings (
            category varchar(64) not null primary key,
            featured varchar(180) null,
            sort_order json null,
            overlay tinyint not null default 55,
            video varchar(180) null,
            video_none tinyint not null default 0,
            updated_at timestamp not null default current_timestamp on update current_timestamp
        )',
    );
    return $db;
}

/** @var list<string> */
const BRIDGE_CATEGORIES = [
    'decks',
    'decking-options',
    'kitchens',
    'bathrooms',
    'garages',
    'additions',
    'basements',
    'commercial',
    'porches',
    'poolhouses',
    'pergolas',
    'outdoor-spaces',
    'fireplaces',
    'hd-renderings',
];

function bridge_category(string $value): ?string
{
    return in_array($value, BRIDGE_CATEGORIES, true) ? $value : null;
}
