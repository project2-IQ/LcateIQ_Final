<?php

declare(strict_types=1);

function locateiq_json_response(int $code, array $data): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function locateiq_read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $j = json_decode($raw, true);
    return is_array($j) ? $j : [];
}

function locateiq_int_param(string $name): ?int
{
    if (!isset($_GET[$name])) {
        return null;
    }
    $v = filter_var($_GET[$name], FILTER_VALIDATE_INT);
    return $v === false ? null : (int) $v;
}
