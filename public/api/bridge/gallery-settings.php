<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

bridge_require_user();

try {
    $db = bridge_db();
} catch (Throwable $e) {
    bridge_json(['ok' => false, 'error' => $e->getMessage()], 503);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    $category = bridge_category((string) ($_GET['category'] ?? ''));
    if (!$category) {
        $rows = [];
        $result = $db->query('select category, featured, sort_order, overlay, video, video_none from gallery_settings');
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = bridge_row($row);
            }
        }
        $db->close();
        bridge_json(['ok' => true, 'folders' => $rows]);
    }
    $stmt = $db->prepare('select category, featured, sort_order, overlay, video, video_none from gallery_settings where category = ?');
    $stmt->bind_param('s', $category);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $db->close();
    bridge_json(['ok' => true, 'settings' => $row ? bridge_row($row) : null]);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    bridge_json(['ok' => false, 'error' => 'Use GET or POST.'], 405);
}

$raw = file_get_contents('php://input');
$body = is_string($raw) ? json_decode($raw, true) : null;
if (!is_array($body)) {
    bridge_json(['ok' => false, 'error' => 'Send JSON.'], 400);
}
$category = bridge_category((string) ($body['category'] ?? ''));
if (!$category) {
    bridge_json(['ok' => false, 'error' => 'Unknown gallery.'], 400);
}

$overlay = isset($body['overlay']) ? (int) $body['overlay'] : 55;
$overlay = max(0, min(80, $overlay));
$featured = isset($body['featured']) && is_string($body['featured']) ? $body['featured'] : null;
$order = [];
if (isset($body['order']) && is_array($body['order'])) {
    foreach ($body['order'] as $name) {
        if (is_string($name) && $name !== '' && !str_contains($name, '/') && !str_contains($name, '\\')) {
            $order[] = $name;
        }
    }
}
$videoNone = 0;
$video = null;
if (array_key_exists('video', $body)) {
    if ($body['video'] === null || $body['video'] === '') {
        $videoNone = 1;
        $video = null;
    } elseif (is_string($body['video'])) {
        $video = $body['video'];
    }
}

$orderJson = json_encode($order, JSON_UNESCAPED_SLASHES);
$stmt = $db->prepare(
    'insert into gallery_settings (category, featured, sort_order, overlay, video, video_none)
     values (?, ?, ?, ?, ?, ?)
     on duplicate key update
       featured = values(featured),
       sort_order = values(sort_order),
       overlay = values(overlay),
       video = values(video),
       video_none = values(video_none)',
);
$stmt->bind_param('sssisi', $category, $featured, $orderJson, $overlay, $video, $videoNone);
$ok = $stmt->execute();
$stmt->close();
$db->close();
if (!$ok) {
    bridge_json(['ok' => false, 'error' => 'Could not save.'], 500);
}
bridge_json(['ok' => true, 'category' => $category, 'overlay' => $overlay]);

function bridge_row(array $row): array
{
    $order = json_decode((string) ($row['sort_order'] ?? '[]'), true);
    return [
        'category' => $row['category'],
        'featured' => $row['featured'],
        'order' => is_array($order) ? $order : [],
        'overlay' => (int) $row['overlay'],
        'video' => ((int) $row['video_none'] === 1) ? null : ($row['video'] ?: null),
    ];
}
