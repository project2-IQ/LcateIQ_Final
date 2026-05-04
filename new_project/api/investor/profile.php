<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/http.php';

$userId = locateiq_int_param('user_id');
if ($userId === null) {
    $userId = locateiq_int_param('userID');
}
if ($userId === null || $userId < 1) {
    locateiq_json_response(422, ['detail' => 'Missing user_id']);
}

$db = locateiq_mysqli();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare(
        'SELECT userID, name, email, registrationDate, phoneNumber, nationalID, birthDate, profileImage FROM users WHERE userID = ? LIMIT 1'
    );
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$row) {
        locateiq_json_response(404, ['detail' => 'المستخدم غير موجود']);
    }

    $role = ($row['email'] === 'admin@locateiq.com') ? 'admin' : 'user';

    locateiq_json_response(200, [
        'id' => (int) $row['userID'],
        'name' => $row['name'],
        'email' => $row['email'],
        'role' => $role,
        'created_at' => $row['registrationDate'],
        'phone' => $row['phoneNumber'],
        'national_id' => $row['nationalID'],
        'birth_date' => $row['birthDate'],
        'avatar' => $row['profileImage'],
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body = locateiq_read_json_body();
    $name = isset($body['name']) ? trim((string) $body['name']) : '';
    $email = isset($body['email']) ? trim((string) $body['email']) : '';
    $phone = isset($body['phone']) ? trim((string) $body['phone']) : null;
    $national_id = isset($body['national_id']) ? trim((string) $body['national_id']) : null;
    $birth_date = isset($body['birth_date']) ? trim((string) $body['birth_date']) : null;

    if ($name === '' || $email === '') {
        locateiq_json_response(422, ['detail' => 'Missing name or email']);
    }

    $stmt = $db->prepare(
        'UPDATE users SET name = ?, email = ?, phoneNumber = ?, nationalID = ?, birthDate = ? WHERE userID = ?'
    );
    $stmt->bind_param('sssssi', $name, $email, $phone, $national_id, $birth_date, $userId);
    $stmt->execute();
    $stmt->close();

    locateiq_json_response(200, ['message' => 'Profile updated successfully']);
}

locateiq_json_response(405, ['detail' => 'Method not allowed']);
