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

function bridge_csrf_token(): string
{
    bridge_start_session();
    $token = $_SESSION['bridge_csrf'] ?? null;
    if (!is_string($token) || strlen($token) < 32) {
        $token = bin2hex(random_bytes(32));
        $_SESSION['bridge_csrf'] = $token;
    }
    return $token;
}

/**
 * Protect state-changing bridge requests against cross-site form and fetch
 * requests. The token is scoped to the existing staff session, while the
 * origin check also covers clients that do not send a custom header.
 */
function bridge_require_request_protection(): void
{
    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    $referer = (string) ($_SERVER['HTTP_REFERER'] ?? '');
    $source = $origin !== '' ? $origin : $referer;
    $sourceHost = $source !== '' ? strtolower((string) (parse_url($source, PHP_URL_HOST) ?? '')) : '';
    if ($host === '' || $sourceHost === '' || !hash_equals($host, $sourceHost)) {
        bridge_json(['ok' => false, 'error' => 'Request protection check failed.'], 403);
    }
    $provided = (string) ($_SERVER['HTTP_X_PFEIFER_CSRF'] ?? '');
    $expected = bridge_csrf_token();
    if ($provided === '' || !hash_equals($expected, $provided)) {
        bridge_json(['ok' => false, 'error' => 'Request protection check failed.'], 403);
    }
}

function bridge_log(Throwable $error): void
{
    error_log('[pfeifer bridge] ' . get_class($error) . ': ' . $error->getMessage());
}

function bridge_media_root(): string
{
    $cfg = bridge_config();
    $configured = trim((string) ($cfg['media_root'] ?? ''));
    // uploads/ is intentionally outside the Git-managed images/ and videos/
    // seed trees. A server may override this with an absolute persistent path.
    $root = $configured !== '' ? $configured : dirname(__DIR__, 2) . '/uploads';
    if (!str_starts_with($root, '/')) {
        $root = dirname(__DIR__, 2) . '/' . ltrim($root, '/');
    }
    return rtrim($root, '/\\');
}

function bridge_media_url(string $relative): string
{
    $cfg = bridge_config();
    $prefix = trim((string) ($cfg['media_url_prefix'] ?? '/uploads'), '/');
    return '/' . ($prefix !== '' ? $prefix . '/' : '') . ltrim(str_replace('\\', '/', $relative), '/');
}

function bridge_safe_part(string $value, string $fallback = 'photo'): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    $value = trim($value, '-');
    return substr($value !== '' ? $value : $fallback, 0, 48);
}

function bridge_media_name(string $category, string $city, string $what, string $extension): string
{
    $label = bridge_safe_part($what);
    $cityPart = bridge_safe_part($city, '');
    $prefix = $cityPart !== '' ? 'pfeifer-' . $cityPart . '-' . $label : 'pfeifer-' . $label;
    return $prefix . '-' . bin2hex(random_bytes(10)) . '.' . $extension;
}

function bridge_media_path(string $category, string $name): string
{
    if (bridge_category($category) === null || $name === '' || basename($name) !== $name || str_starts_with($name, '.')) {
        throw new InvalidArgumentException('Invalid media path.');
    }
    return bridge_media_root() . '/galleries/' . $category . '/' . $name;
}

function bridge_video_path(string $category, string $name): string
{
    if (bridge_category($category) === null || $name === '' || basename($name) !== $name || str_starts_with($name, '.')) {
        throw new InvalidArgumentException('Invalid video path.');
    }
    return bridge_media_root() . '/videos/' . $category . '/' . $name;
}

function bridge_ensure_media_dirs(string $category): array
{
    $gallery = bridge_media_root() . '/galleries/' . $category;
    $video = bridge_media_root() . '/videos/' . $category;
    if (!is_dir($gallery) && !mkdir($gallery, 0750, true) && !is_dir($gallery)) {
        throw new RuntimeException('Could not create media storage.');
    }
    if (!is_dir($video) && !mkdir($video, 0750, true) && !is_dir($video)) {
        throw new RuntimeException('Could not create media storage.');
    }
    return [$gallery, $video];
}

function bridge_atomic_move(string $source, string $destination): void
{
    if (!rename($source, $destination)) {
        throw new RuntimeException('Could not store media.');
    }
}

/**
 * Return durable uploads only. Git-managed seed assets are deliberately not
 * scanned or written by these APIs.
 *
 * @return list<array{name:string,url:string,bytes:int,kind:string}>
 */
function bridge_media_files(string $category): array
{
    $files = [];
    $roots = [
        [
            'dir' => bridge_media_root() . '/galleries/' . $category,
            'url' => 'galleries/' . $category,
        ],
        // Read-only compatibility with seed trees copied to SiteGround. The
        // upload API never writes to either of these locations.
        [
            'dir' => dirname(__DIR__, 2) . '/images/galleries/' . $category,
            'url' => 'images/galleries/' . $category,
        ],
        [
            'dir' => dirname(__DIR__, 2) . '/images/' . $category,
            'url' => 'images/' . $category,
        ],
    ];
    $seen = [];
    foreach ($roots as $root) {
        $dir = $root['dir'];
        if (!is_dir($dir)) continue;
        foreach (scandir($dir) ?: [] as $name) {
            if ($name === '.' || $name === '..' || str_ends_with($name, '-thumb.jpg') || !preg_match('/\.jpg$/i', $name)) continue;
            $path = $dir . '/' . $name;
            if (!is_file($path) || isset($seen[$name])) continue;
            $seen[$name] = true;
            $thumb = preg_replace('/\.jpg$/i', '-thumb.jpg', $name);
            $thumbPath = $dir . '/' . $thumb;
            $files[] = [
                'name' => $name,
                'url' => str_starts_with($root['url'], 'galleries/')
                    ? bridge_media_url($root['url'] . '/' . $name)
                    : '/' . $root['url'] . '/' . $name,
                'bytes' => (int) filesize($path),
                'kind' => 'large',
            ];
            if (is_file($thumbPath)) {
                $files[] = [
                    'name' => $thumb,
                    'url' => str_starts_with($root['url'], 'galleries/')
                        ? bridge_media_url($root['url'] . '/' . $thumb)
                        : '/' . $root['url'] . '/' . $thumb,
                    'bytes' => (int) filesize($thumbPath),
                    'kind' => 'thumb',
                ];
            }
        }
    }
    usort($files, static fn(array $a, array $b): int => strcmp($a['name'], $b['name']));
    return $files;
}

function bridge_settings_for_category(mysqli $db, string $category): array
{
    $stmt = $db->prepare('select category, featured, sort_order, overlay, video, video_none from gallery_settings where category = ?');
    if (!$stmt) return [];
    $stmt->bind_param('s', $category);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if (!is_array($row)) return [];
    $order = json_decode((string) ($row['sort_order'] ?? '[]'), true);
    return [
        'featured' => is_string($row['featured'] ?? null) ? $row['featured'] : null,
        'order' => is_array($order) ? array_values(array_filter($order, 'is_string')) : [],
        'overlay' => max(0, min(80, (int) ($row['overlay'] ?? 55))),
        'video' => ((int) ($row['video_none'] ?? 0) === 1) ? null : (($row['video'] ?? null) ?: null),
    ];
}

function bridge_media_folder(mysqli $db, string $category): array
{
    $files = bridge_media_files($category);
    $large = array_values(array_filter($files, static fn(array $file): bool => $file['kind'] === 'large'));
    $settings = bridge_settings_for_category($db, $category);
    $names = array_column($large, 'name');
    $order = [];
    foreach (($settings['order'] ?? []) as $name) {
        if (in_array($name, $names, true) && !in_array($name, $order, true)) $order[] = $name;
    }
    foreach ($names as $name) if (!in_array($name, $order, true)) $order[] = $name;
    $featured = in_array($settings['featured'] ?? null, $names, true) ? $settings['featured'] : ($order[0] ?? null);
    $videoName = $settings['video'] ?? null;
    $videoUrl = null;
    if (is_string($videoName) && $videoName !== '') {
        $uploaded = bridge_video_path($category, $videoName);
        if (is_file($uploaded)) {
            $videoUrl = bridge_media_url('videos/' . $category . '/' . $videoName);
        } else {
            // Existing seed videos remain readable, but can never be deleted
            // through the durable upload API.
            $legacy = dirname(__DIR__, 2) . '/videos/' . basename($videoName);
            if (is_file($legacy)) $videoUrl = '/videos/' . basename($videoName);
        }
    }
    return [
        'category' => $category,
        'count' => count($order),
        'files' => $files,
        'featured' => $featured,
        'order' => $order,
        'overlay' => (int) ($settings['overlay'] ?? 55),
        'videoName' => $videoUrl !== null ? $videoName : null,
        'videoUrl' => $videoUrl,
        'publicPath' => bridge_media_url('galleries/' . $category),
    ];
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
    'kitchens',
    'bathrooms',
    'garages',
    'additions',
    'basements',
    'commercial',
    'porches',
    'poolhouses',
    'outdoor-spaces',
    'fireplaces',
    'hd-renderings',
];

function bridge_category(string $value): ?string
{
    return in_array($value, BRIDGE_CATEGORIES, true) ? $value : null;
}
