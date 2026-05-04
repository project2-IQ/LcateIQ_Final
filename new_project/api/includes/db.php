<?php

declare(strict_types=1);

function locateiq_config(): array
{
    static $c;
    if ($c === null) {
        $c = require __DIR__ . '/config.php';
    }
    return $c;
}

function locateiq_mysqli(): mysqli
{
    static $conn;
    if ($conn instanceof mysqli) {
        return $conn;
    }
    $c = locateiq_config();
    $conn = new mysqli($c['db_host'], $c['db_user'], $c['db_pass'], $c['db_name']);
    if ($conn->connect_error) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['detail' => 'Database connection failed']);
        exit;
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

function locateiq_hash_password(string $password): string
{
    return hash('sha256', $password);
}
