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
bridge_require_request_protection();

$raw = file_get_contents('php://input');
$body = is_string($raw) ? json_decode($raw, true) : null;
if (!is_array($body)) {
    bridge_json(['ok' => false, 'error' => 'Send JSON.'], 400);
}
$category = bridge_category((string) ($body['category'] ?? ''));
if (!$category) {
    bridge_json(['ok' => false, 'error' => 'Unknown gallery.'], 400);
}

$hasFeatured = array_key_exists('featured', $body);
$hasOrder = array_key_exists('order', $body);
$hasOverlay = array_key_exists('overlay', $body);
$hasVideo = array_key_exists('video', $body);
if (!$hasFeatured && !$hasOrder && !$hasOverlay && !$hasVideo) {
    bridge_json(['ok' => false, 'error' => 'No setting was supplied.'], 400);
}
$overlay = isset($body['overlay']) ? max(0, min(80, (int) $body['overlay'])) : 55;
$featured = $hasFeatured && is_string($body['featured']) ? $body['featured'] : null;
$order = [];
if ($hasOrder && is_array($body['order'])) {
    foreach ($body['order'] as $name) {
        if (is_string($name) && $name !== '' && !str_contains($name, '/') && !str_contains($name, '\\')) {
            $order[] = $name;
        }
    }
}
$videoNone = 0;
$video = null;
if ($hasVideo) {
    if ($body['video'] === null || $body['video'] === '') {
        $videoNone = 1;
        $video = null;
    } elseif (is_string($body['video'])) {
        $video = $body['video'];
    }
}

$orderJson = json_encode($order, JSON_UNESCAPED_SLASHES);
$ok = $db->query(
    "insert ignore into gallery_settings (category) values ('" . $db->real_escape_string($category) . "')",
);
if ($ok && $hasFeatured) {
    $stmt = $db->prepare('update gallery_settings set featured = ? where category = ?');
    if (!$stmt) { $ok = false; } else { $stmt->bind_param('ss', $featured, $category); $ok = $stmt->execute(); $stmt->close(); }
}
if ($ok && $hasOrder) {
    $stmt = $db->prepare('update gallery_settings set sort_order = ? where category = ?');
    if (!$stmt) { $ok = false; } else { $stmt->bind_param('ss', $orderJson, $category); $ok = $stmt->execute(); $stmt->close(); }
}
if ($ok && $hasOverlay) {
    $stmt = $db->prepare('update gallery_settings set overlay = ? where category = ?');
    if (!$stmt) { $ok = false; } else { $stmt->bind_param('is', $overlay, $category); $ok = $stmt->execute(); $stmt->close(); }
}
if ($ok && $hasVideo) {
    $stmt = $db->prepare('update gallery_settings set video = ?, video_none = ? where category = ?');
    if (!$stmt) { $ok = false; } else { $stmt->bind_param('sis', $video, $videoNone, $category); $ok = $stmt->execute(); $stmt->close(); }
}
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
