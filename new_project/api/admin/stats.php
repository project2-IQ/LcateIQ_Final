<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    locateiq_json_response(405, ['detail' => 'Method not allowed']);
}

$db = locateiq_mysqli();
$users = (int) $db->query('SELECT COUNT(*) AS c FROM users')->fetch_assoc()['c'];
$chats = (int) $db->query('SELECT COUNT(*) AS c FROM ai_chat_analysis')->fetch_assoc()['c'];

header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'total_users' => $users,
    'total_analyses' => $chats,
    'active_now' => min(3, max(1, (int) ceil($users / 4))),
], JSON_UNESCAPED_UNICODE);
