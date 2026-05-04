<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    locateiq_json_response(405, ['detail' => 'Method not allowed']);
}

$body = locateiq_read_json_body();
$name = isset($body['name']) ? trim((string) $body['name']) : '';
$email = isset($body['email']) ? trim((string) $body['email']) : '';
$password = isset($body['password']) ? (string) $body['password'] : '';

if ($name === '' || $email === '' || $password === '') {
    locateiq_json_response(422, ['detail' => 'Missing fields']);
}

$db = locateiq_mysqli();

$check = $db->prepare('SELECT userID FROM users WHERE email = ? LIMIT 1');
$check->bind_param('s', $email);
$check->execute();
if ($check->get_result()->fetch_assoc()) {
    $check->close();
    locateiq_json_response(400, ['detail' => 'البريد الإلكتروني مستخدم مسبقاً']);
}
$check->close();

$hash = locateiq_hash_password($password);
$lang = 'ar';

$stmt = $db->prepare('INSERT INTO users (name, email, password, language) VALUES (?, ?, ?, ?)');
$stmt->bind_param('ssss', $name, $email, $hash, $lang);
$stmt->execute();
$newId = (int) $stmt->insert_id;
$stmt->close();

locateiq_json_response(200, [
    'userID' => $newId,
    'name' => $name,
    'email' => $email,
    'language' => $lang,
    'registrationDate' => null,
]);
