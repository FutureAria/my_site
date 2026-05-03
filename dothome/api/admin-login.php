<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['message' => '허용되지 않는 요청입니다.'], 405);
}

$raw = file_get_contents('php://input');
$body = json_decode($raw ?: '{}', true);
$password = is_array($body) ? ($body['password'] ?? '') : '';

if ($password !== ADMIN_PASSWORD) {
    json_response(['message' => '비밀번호가 올바르지 않습니다.'], 401);
}

setcookie(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, [
    'expires' => time() + 60 * 60 * 8,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    'httponly' => true,
    'samesite' => 'Lax',
]);

json_response(['ok' => true]);

