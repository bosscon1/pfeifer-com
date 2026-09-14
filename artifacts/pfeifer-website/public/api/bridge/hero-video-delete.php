<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

bridge_require_user();
bridge_require_request_protection();
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') bridge_json(['ok' => false, 'error' => 'Use POST.'], 405);

try {
    $raw = file_get_contents('php://input');
    $body = is_string($raw) ? json_decode($raw, true) : null;
    $category = is_array($body) ? bridge_category((string) ($body['category'] ?? '')) : null;
    if (!$category) bridge_json(['ok' => false, 'error' => 'Unknown gallery.'], 400);
    $db = bridge_db();
    $settings = bridge_settings_for_category($db, $category);
    $name = is_string($settings['video'] ?? null) ? $settings['video'] : '';
    // Only durable uploads are removable; seed files under public/videos stay intact.
    if ($name !== '' && preg_match('/^hero-[a-z0-9-]+-[a-f0-9]{20}\.mp4$/', $name)) {
        @unlink(bridge_video_path($category, $name));
    }
    $stmt = $db->prepare('insert into gallery_settings (category, video, video_none) values (?, null, 1) on duplicate key update video = null, video_none = 1');
    if (!$stmt) throw new RuntimeException('Could not save video setting.');
    $stmt->bind_param('s', $category);
    $stmt->execute();
    $stmt->close();
    $folder = bridge_media_folder($db, $category);
    $db->close();
    bridge_json(['ok' => true, 'folder' => $folder]);
} catch (Throwable $error) {
    bridge_log($error);
    bridge_json(['ok' => false, 'error' => 'Could not remove that video.'], 500);
}