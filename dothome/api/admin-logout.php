<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

setcookie(ADMIN_COOKIE, '', [
    'expires' => time() - 3600,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    'httponly' => true,
    'samesite' => 'Lax',
]);

json_response(['ok' => true]);

