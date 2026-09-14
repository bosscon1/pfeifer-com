<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

bridge_require_user();
bridge_require_request_protection();
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') bridge_json(['ok' => false, 'error' => 'Use POST.'], 405);

try {
    $category = bridge_category((string) ($_POST['category'] ?? ''));
    $file = $_FILES['video'] ?? null;
    if (!$category || !is_array($file) || (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        bridge_json(['ok' => false, 'error' => 'Choose an MP4 video.'], 400);
    }
    $tmp = (string) ($file['tmp_name'] ?? '');
    $size = (int) ($file['size'] ?? 0);
    if ($size < 32 || $size > 18 * 1024 * 1024 || !is_uploaded_file($tmp)) {
        bridge_json(['ok' => false, 'error' => 'Keep the hero video under 18 MB.'], 400);
    }
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($tmp);
    $header = (string) file_get_contents($tmp, false, null, 0, 32);
    if ($mime !== 'video/mp4' || substr($header, 4, 4) !== 'ftyp') {
        bridge_json(['ok' => false, 'error' => 'Use a valid MP4 video.'], 400);
    }
    [$unused, $videoDir] = bridge_ensure_media_dirs($category);
    $name = 'hero-' . $category . '-' . bin2hex(random_bytes(10)) . '.mp4';
    $staged = $videoDir . '/.' . $name . '.upload';
    if (!move_uploaded_file($tmp, $staged)) throw new RuntimeException('Could not stage video.');
    $path = $videoDir . '/' . $name;
    bridge_atomic_move($staged, $path);
    chmod($path, 0640);
    $db = bridge_db();
    $stmt = $db->prepare(
        'insert into gallery_settings (category, video, video_none) values (?, ?, 0)
         on duplicate key update video = values(video), video_none = 0',
    );
    if (!$stmt) throw new RuntimeException('Could not save video setting.');
    $stmt->bind_param('ss', $category, $name);
    $stmt->execute();
    $stmt->close();
    $folder = bridge_media_folder($db, $category);
    $db->close();
    bridge_json(['ok' => true, 'name' => $name, 'folder' => $folder]);
} catch (Throwable $error) {
    if (isset($staged) && is_string($staged)) @unlink($staged);
    bridge_log($error);
    bridge_json(['ok' => false, 'error' => 'Hero video upload failed.'], 500);
}