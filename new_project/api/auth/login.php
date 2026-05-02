<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    locateiq_json_response(405, ['detail' => 'Method not allowed']);
}

$body = locateiq_read_json_body();
$email = isset($body['email']) ? trim((string) $body['email']) : '';
$password = isset($body['password']) ? (string) $body['password'] : '';

if ($email === '' || $password === '') {
    locateiq_json_response(422, ['detail' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
}

$db = locateiq_mysqli();
$hash = locateiq_hash_password($password);

$stmt = $db->prepare('SELECT userID, name, email FROM users WHERE email = ? AND password = ? LIMIT 1');
$stmt->bind_param('ss', $email, $hash);
$stmt->execute();
$res = $stmt->get_result();
$row = $res->fetch_assoc();
$stmt->close();

if (!$row) {
    locateiq_json_response(401, ['detail' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
}

$role = ($row['email'] === 'admin@locateiq.com') ? 'admin' : 'user';

locateiq_json_response(200, [
    'status' => 'success',
    'userID' => (int) $row['userID'],
    'name' => $row['name'],
    'email' => $row['email'],
    'role' => $role,
    'message' => 'تم تسجيل الدخول بنجاح',
]);
