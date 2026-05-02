<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/http.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    locateiq_json_response(405, ['detail' => 'Method not allowed']);
}

$userId = locateiq_int_param('user_id');
if ($userId === null) {
    $userId = locateiq_int_param('userID');
}
if ($userId === null || $userId < 1) {
    locateiq_json_response(422, ['detail' => 'Missing user_id']);
}

$db = locateiq_mysqli();

$stmt = $db->prepare(
    'SELECT chatID, message, aiResponse, confidenceScore, timestamp_created,
            project_name, location_label, cluster_val, score_val
     FROM ai_chat_analysis
     WHERE userID = ?
     ORDER BY timestamp_created DESC
     LIMIT 10'
);
$stmt->bind_param('i', $userId);
$stmt->execute();
$res = $stmt->get_result();

$out = [];
while ($row = $res->fetch_assoc()) {
    $scorePct = $row['score_val'] !== null
        ? (float) $row['score_val']
        : (($row['confidenceScore'] !== null ? (float) $row['confidenceScore'] : 0) * 100);

    $out[] = [
        'id' => (int) $row['chatID'],
        'message' => $row['message'],
        'response' => $row['aiResponse'],
        'score' => round($scorePct, 2),
        'date' => $row['timestamp_created'],
        'project_name' => $row['project_name'] ?? '',
        'location' => $row['location_label'] ?? '',
        'cluster' => isset($row['cluster_val']) ? (int) $row['cluster_val'] : 0,
    ];
}
$stmt->close();

header('Content-Type: application/json; charset=utf-8');
echo json_encode($out, JSON_UNESCAPED_UNICODE);
