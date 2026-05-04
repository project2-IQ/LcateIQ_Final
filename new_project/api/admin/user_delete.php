<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    locateiq_json_response(405, ['detail' => 'Method not allowed']);
}

$body = locateiq_read_json_body();
$id = isset($body['id']) ? (int) $body['id'] : 0;
if ($id < 1) {
    locateiq_json_response(422, ['detail' => 'Invalid id']);
}

$db = locateiq_mysqli();
$chk = $db->prepare('SELECT email FROM users WHERE userID = ? LIMIT 1');
$chk->bind_param('i', $id);
$chk->execute();
$row = $chk->get_result()->fetch_assoc();
$chk->close();

if (!$row) {
    locateiq_json_response(404, ['detail' => 'Not found']);
}

if ($row['email'] === 'admin@locateiq.com') {
    locateiq_json_response(403, ['detail' => 'Cannot delete admin']);
}

$del = $db->prepare('DELETE FROM users WHERE userID = ?');
$del->bind_param('i', $id);
$del->execute();
$del->close();

locateiq_json_response(200, ['message' => 'deleted']);
