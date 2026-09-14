<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

bridge_require_user();

try {
    $db = bridge_db();
    $requested = (string) ($_GET['category'] ?? '');
    $categories = $requested !== '' ? [bridge_category($requested)] : BRIDGE_CATEGORIES;
    if (in_array(null, $categories, true)) {
        $db->close();
        bridge_json(['ok' => false, 'error' => 'Unknown gallery.'], 400);
    }
    $folders = [];
    foreach ($categories as $category) {
        if (is_string($category)) $folders[] = bridge_media_folder($db, $category);
    }
    $db->close();
    bridge_json(['ok' => true, 'folders' => $folders]);
} catch (Throwable $error) {
    bridge_log($error);
    bridge_json(['ok' => false, 'error' => 'Could not list gallery media.'], 503);
}