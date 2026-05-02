<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    locateiq_json_response(405, ['detail' => 'Method not allowed']);
}

$userId = locateiq_int_param('user_id');
if ($userId === null) {
    $userId = locateiq_int_param('userID');
}
if ($userId === null || $userId < 1) {
    locateiq_json_response(422, ['detail' => 'Missing user_id']);
}

$body = locateiq_read_json_body();
$current = isset($body['current_password']) ? (string) $body['current_password'] : '';
$new = isset($body['new_password']) ? (string) $body['new_password'] : '';

$db = locateiq_mysqli();
$stmt = $db->prepare('SELECT password FROM users WHERE userID = ? LIMIT 1');
$stmt->bind_param('i', $userId);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
    locateiq_json_response(404, ['detail' => 'المستخدم غير موجود']);
}

if (locateiq_hash_password($current) !== $row['password']) {
    locateiq_json_response(401, ['detail' => 'Current password is incorrect']);
}

$newHash = locateiq_hash_password($new);
$upd = $db->prepare('UPDATE users SET password = ? WHERE userID = ?');
$upd->bind_param('si', $newHash, $userId);
$upd->execute();
$upd->close();

locateiq_json_response(200, ['message' => 'Password changed successfully']);
