<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['message' => '허용되지 않는 요청입니다.'], 405);
}

$uploadDir = root_path('uploads');
$maxFiles = 20;
$imageMaxSize = 8 * 1024 * 1024;
$pdfMaxSize = 8 * 1024 * 1024;
$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
    'application/pdf' => 'pdf',
];

function optimize_image_upload(string $tmpName, string $target): bool
{
    if (!function_exists('imagewebp')) {
        return false;
    }

    $info = @getimagesize($tmpName);
    if (!$info) {
        return false;
    }

    [$width, $height] = $info;
    $mime = $info['mime'] ?? '';

    if ($mime === 'image/jpeg') {
        $source = @imagecreatefromjpeg($tmpName);
    } elseif ($mime === 'image/png') {
        $source = @imagecreatefrompng($tmpName);
    } elseif ($mime === 'image/webp' && function_exists('imagecreatefromwebp')) {
        $source = @imagecreatefromwebp($tmpName);
    } else {
        return false;
    }

    if (!$source) {
        return false;
    }

    $maxWidth = 1600;
    $targetWidth = min($width, $maxWidth);
    $targetHeight = (int) round($height * ($targetWidth / max($width, 1)));
    $canvas = imagecreatetruecolor($targetWidth, $targetHeight);
    imagealphablending($canvas, true);
    imagesavealpha($canvas, true);
    imagecopyresampled($canvas, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

    $ok = imagewebp($canvas, $target, 76);
    imagedestroy($source);
    imagedestroy($canvas);

    return $ok;
}

if (!isset($_FILES['files'])) {
    json_response(['message' => '업로드할 파일이 없습니다.'], 400);
}

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

$names = $_FILES['files']['name'];
$tmpNames = $_FILES['files']['tmp_name'];
$types = $_FILES['files']['type'];
$sizes = $_FILES['files']['size'];
$errors = $_FILES['files']['error'];

if (!is_array($names)) {
    $names = [$names];
    $tmpNames = [$tmpNames];
    $types = [$types];
    $sizes = [$sizes];
    $errors = [$errors];
}

if (count($names) > $maxFiles) {
    json_response(['message' => "파일은 한 번에 최대 {$maxFiles}개까지 업로드할 수 있습니다."], 400);
}

$paths = [];

foreach ($names as $index => $name) {
    if (($errors[$index] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        json_response(['message' => '파일 업로드 중 오류가 발생했습니다.'], 400);
    }

    $tmpName = $tmpNames[$index];
    $detectedType = mime_content_type($tmpName) ?: ($types[$index] ?? '');
    if (!isset($allowedTypes[$detectedType])) {
        json_response(['message' => 'jpg, png, webp, gif, pdf 파일만 업로드할 수 있습니다.'], 400);
    }

    $maxSize = $detectedType === 'application/pdf' ? $pdfMaxSize : $imageMaxSize;
    if (($sizes[$index] ?? 0) > $maxSize) {
        json_response(['message' => '서버 용량 보호를 위해 이미지는 8MB, PDF는 8MB까지 업로드할 수 있습니다.'], 400);
    }

    $canOptimize = in_array($detectedType, ['image/jpeg', 'image/png', 'image/webp'], true);
    $extension = $canOptimize ? 'webp' : $allowedTypes[$detectedType];
    $filename = 'admin-' . round(microtime(true) * 1000) . '-' . $index . '.' . $extension;
    $target = $uploadDir . '/' . $filename;

    if ($canOptimize && optimize_image_upload($tmpName, $target)) {
        $paths[] = '/uploads/' . $filename;
        continue;
    }

    if (!move_uploaded_file($tmpName, $target)) {
        json_response(['message' => '파일 저장 중 오류가 발생했습니다. uploads 권한을 확인하세요.'], 500);
    }

    $paths[] = '/uploads/' . $filename;
}

json_response(['paths' => $paths]);
