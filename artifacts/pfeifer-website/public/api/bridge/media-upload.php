<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

bridge_require_user();
bridge_require_request_protection();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    bridge_json(['ok' => false, 'error' => 'Use POST.'], 405);
}

function media_upload_error(int $code): string
{
    return match ($code) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'That photo is too large.',
        UPLOAD_ERR_NO_FILE => 'No photo was received.',
        default => 'Could not receive that photo.',
    };
}

try {
    $category = bridge_category((string) ($_POST['category'] ?? ''));
    $what = trim((string) ($_POST['what'] ?? ''));
    $city = trim((string) ($_POST['city'] ?? ''));
    if (!$category || $what === '' || strlen($what) > 48 || strlen($city) > 40) {
        bridge_json(['ok' => false, 'error' => 'Choose a gallery and describe the photos.'], 400);
    }
    if (!isset($_FILES['files']) || !is_array($_FILES['files']['name'] ?? null)) {
        bridge_json(['ok' => false, 'error' => 'Choose one or more photos.'], 400);
    }
    $names = $_FILES['files']['name'];
    $tmpNames = $_FILES['files']['tmp_name'];
    $sizes = $_FILES['files']['size'];
    $errors = $_FILES['files']['error'];
    if (count($names) < 1 || count($names) > 12) {
        bridge_json(['ok' => false, 'error' => 'Choose between one and twelve photos.'], 400);
    }
    [$galleryDir] = bridge_ensure_media_dirs($category);
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $results = [];
    $maxBytes = 20 * 1024 * 1024;
    foreach ($names as $index => $original) {
        $tmp = (string) ($tmpNames[$index] ?? '');
        $size = (int) ($sizes[$index] ?? 0);
        $code = (int) ($errors[$index] ?? UPLOAD_ERR_NO_FILE);
        $result = ['original' => basename((string) $original), 'largeUrl' => '', 'thumbUrl' => '', 'error' => null];
        if ($code !== UPLOAD_ERR_OK) {
            $result['error'] = media_upload_error($code);
            $results[] = $result;
            continue;
        }
        if ($size < 32 || $size > $maxBytes || !is_uploaded_file($tmp)) {
            $result['error'] = 'Photo size is not allowed.';
            $results[] = $result;
            continue;
        }
        $mime = $finfo->file($tmp);
        $allowed = ['image/jpeg', 'image/png', 'image/webp'];
        $dimensions = @getimagesize($tmp);
        if (!in_array($mime, $allowed, true) || !is_array($dimensions)
            || (int) ($dimensions[0] ?? 0) < 200 || (int) ($dimensions[1] ?? 0) < 200
            || (int) ($dimensions[0] ?? 0) > 12000 || (int) ($dimensions[1] ?? 0) > 12000) {
            $result['error'] = 'Use a valid photo between 200px and 12000px.';
            $results[] = $result;
            continue;
        }
        $name = bridge_media_name($category, $city, $what, 'jpg');
        $thumb = preg_replace('/\.jpg$/', '-thumb.jpg', $name);
        $source = $galleryDir . '/.' . $name . '.upload';
        $largePath = $galleryDir . '/' . $name;
        $thumbPath = $galleryDir . '/' . $thumb;
        try {
            if (!move_uploaded_file($tmp, $source)) throw new RuntimeException('Could not stage photo.');
            if (!function_exists('imagecreatefromstring') || !function_exists('imagejpeg')) {
                throw new RuntimeException('Image processing is not available.');
            }
            $image = @imagecreatefromstring((string) file_get_contents($source));
            if ($image === false) throw new RuntimeException('Could not decode photo.');
            $width = imagesx($image);
            $height = imagesy($image);
            $scale = min(1, 1600 / max($width, $height));
            $large = imagecreatetruecolor(max(1, (int) round($width * $scale)), max(1, (int) round($height * $scale)));
            imagecopyresampled($large, $image, 0, 0, 0, 0, imagesx($large), imagesy($large), $width, $height);
            if (!imagejpeg($large, $largePath, 86)) throw new RuntimeException('Could not write photo.');
            $thumbScale = min(1, 800 / max($width, $height));
            $small = imagecreatetruecolor(max(1, (int) round($width * $thumbScale)), max(1, (int) round($height * $thumbScale)));
            imagecopyresampled($small, $image, 0, 0, 0, 0, imagesx($small), imagesy($small), $width, $height);
            if (!imagejpeg($small, $thumbPath, 82)) throw new RuntimeException('Could not write thumbnail.');
            imagedestroy($small);
            imagedestroy($large);
            imagedestroy($image);
            @unlink($source);
            chmod($largePath, 0640);
            chmod($thumbPath, 0640);
            $result['largeUrl'] = bridge_media_url('galleries/' . $category . '/' . $name);
            $result['thumbUrl'] = bridge_media_url('galleries/' . $category . '/' . $thumb);
            $result['name'] = $name;
        } catch (Throwable $error) {
            @unlink($source);
            @unlink($largePath);
            @unlink($thumbPath);
            bridge_log($error);
            $result['error'] = 'Could not process that photo.';
        }
        $results[] = $result;
    }
    $db = bridge_db();
    $folder = bridge_media_folder($db, $category);
    $db->close();
    bridge_json(['ok' => true, 'category' => $category, 'results' => $results, 'folders' => [$folder]]);
} catch (Throwable $error) {
    bridge_log($error);
    bridge_json(['ok' => false, 'error' => 'Photo upload failed.'], 500);
}