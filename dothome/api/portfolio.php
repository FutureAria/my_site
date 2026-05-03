<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

$file = root_path('data/portfolio.json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!is_file($file)) {
        json_response(['message' => 'portfolio.json 파일을 찾을 수 없습니다.'], 404);
    }

    header('Content-Type: application/json; charset=utf-8');
    readfile($file);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['message' => '허용되지 않는 요청입니다.'], 405);
}

require_admin();

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);

if (!is_array($data) || !isset($data['hero'], $data['about']) || !isset($data['projects']) || !is_array($data['projects']) || !isset($data['blog']) || !is_array($data['blog'])) {
    json_response(['message' => 'portfolio.json 형식이 올바르지 않습니다.'], 400);
}

$dir = dirname($file);
if (!is_dir($dir)) {
    mkdir($dir, 0775, true);
}

$encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($encoded === false || file_put_contents($file, $encoded . PHP_EOL, LOCK_EX) === false) {
    json_response(['message' => '저장 중 오류가 발생했습니다. 파일 권한을 확인하세요.'], 500);
}

json_response(['ok' => true]);

