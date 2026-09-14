<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

bridge_require_user();
bridge_require_request_protection();
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    bridge_json(['ok' => false, 'error' => 'Use POST.'], 405);
}

try {
    $raw = file_get_contents('php://input');
    $body = is_string($raw) ? json_decode($raw, true) : null;
    $category = is_array($body) ? bridge_category((string) ($body['category'] ?? '')) : null;
    $name = is_array($body) ? (string) ($body['name'] ?? '') : '';
    if (!$category || !preg_match('/^pfeifer-[a-z0-9-]+-[a-f0-9]{20}\.jpg$/', $name)) {
        bridge_json(['ok' => false, 'error' => 'That photo cannot be deleted.'], 400);
    }
    $path = bridge_media_path($category, $name);
    if (!is_file($path)) bridge_json(['ok' => false, 'error' => 'That photo was not found.'], 404);
    $thumb = preg_replace('/\.jpg$/', '-thumb.jpg', $name);
    @unlink($path);
    @unlink(bridge_media_path($category, $thumb));
    $db = bridge_db();
    $current = bridge_settings_for_category($db, $category);
    $order = array_values(array_filter($current['order'] ?? [], static fn(string $value): bool => $value !== $name));
    $featured = ($current['featured'] ?? null) === $name ? ($order[0] ?? null) : ($current['featured'] ?? null);
    $orderJson = json_encode($order, JSON_UNESCAPED_SLASHES);
    $stmt = $db->prepare('update gallery_settings set featured = ?, sort_order = ? where category = ?');
    if ($stmt) {
        $stmt->bind_param('sss', $featured, $orderJson, $category);
        $stmt->execute();
        $stmt->close();
    }
    $folder = bridge_media_folder($db, $category);
    $db->close();
    bridge_json(['ok' => true, 'deleted' => $name, 'folder' => $folder]);
} catch (Throwable $error) {
    bridge_log($error);
    bridge_json(['ok' => false, 'error' => 'Could not delete that photo.'], 500);
}