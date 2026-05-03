<?php
declare(strict_types=1);

const ADMIN_COOKIE = 'portfolio_admin';
const ADMIN_COOKIE_VALUE = 'ok';

$configFile = __DIR__ . '/_config.php';
if (is_file($configFile)) {
    require_once $configFile;
}

if (!defined('ADMIN_PASSWORD')) {
    $password = getenv('DOTHOME_ADMIN_PASSWORD') ?: getenv('ADMIN_PASSWORD') ?: 'change-this-password';
    define('ADMIN_PASSWORD', $password);
}

function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function require_admin(): void {
    if (($_COOKIE[ADMIN_COOKIE] ?? '') !== ADMIN_COOKIE_VALUE) {
        json_response(['message' => '관리자 인증이 필요합니다.'], 401);
    }
}

function root_path(string $relative): string {
    return dirname(__DIR__) . '/' . ltrim($relative, '/');
}
