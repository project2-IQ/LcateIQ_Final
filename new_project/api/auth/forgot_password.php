<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    locateiq_json_response(405, ['detail' => 'Method not allowed']);
}

locateiq_json_response(200, ['message' => 'Demo: password reset is not configured for localhost.']);
