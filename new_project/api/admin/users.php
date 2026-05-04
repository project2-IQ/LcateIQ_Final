<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    locateiq_json_response(405, ['detail' => 'Method not allowed']);
}

$db = locateiq_mysqli();
$res = $db->query('SELECT userID, name, email, registrationDate FROM users ORDER BY registrationDate DESC');

$out = [];
while ($row = $res->fetch_assoc()) {
    $out[] = [
        'id' => (int) $row['userID'],
        'name' => $row['name'],
        'email' => $row['email'],
        'role' => ($row['email'] === 'admin@locateiq.com') ? 'admin' : 'user',
        'created_at' => $row['registrationDate'],
        'status' => 'active',
    ];
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($out, JSON_UNESCAPED_UNICODE);
