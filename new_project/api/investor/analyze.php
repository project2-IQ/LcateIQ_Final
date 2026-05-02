<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/http.php';
require_once __DIR__ . '/../includes/location_features.php';
require_once __DIR__ . '/../includes/ml_predict.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    locateiq_json_response(405, ['detail' => 'Method not allowed']);
}

$userId = locateiq_int_param('userID');
if ($userId === null) {
    $userId = locateiq_int_param('user_id');
}
if ($userId === null || $userId < 1) {
    locateiq_json_response(422, ['detail' => 'Missing userID']);
}

$lang = isset($_GET['lang']) ? strtolower((string) $_GET['lang']) : 'ar';
if ($lang !== 'en') {
    $lang = 'ar';
}

$body = locateiq_read_json_body();
$projectName = isset($body['project_name']) ? trim((string) $body['project_name']) : '';
$projectType = isset($body['project_type']) ? trim((string) $body['project_type']) : 'عام';
$location = isset($body['location']) ? trim((string) $body['location']) : 'عسير';

$db = locateiq_mysqli();

$stmt = $db->prepare('SELECT userID FROM users WHERE userID = ? LIMIT 1');
$stmt->bind_param('i', $userId);
$stmt->execute();
if (!$stmt->get_result()->fetch_assoc()) {
    $stmt->close();
    locateiq_json_response(404, ['detail' => 'المستخدم غير موجود']);
}
$stmt->close();

$loc = locateiq_lookup_location($db, $location);
$pd = $loc['population_density'];
$sv = $loc['services_count'];
$cp = $loc['competitors_count'];
$latOut = (float) $loc['latitude'];
$lngOut = (float) $loc['longitude'];

$result = locateiq_ml_predict($pd, $sv, $cp);
if ($result === null || empty($result['ok'])) {
    $result = locateiq_ml_fallback($pd, $sv, $cp);
}

$cluster = (int) $result['cluster'];
$score = (float) $result['score'];
$suitability = ($lang === 'en')
    ? (string) $result['suitability_en']
    : (string) $result['suitability_ar'];

$message = sprintf(
    'Project: %s, Type: %s, Location: %s',
    $projectName !== '' ? $projectName : '(none)',
    $projectType,
    $location
);
$aiResponse = sprintf('Suitability: %s, Score: %s%%', $suitability, (string) $score);

$confidence = min(1.0, max(0.0, $score / 100.0));
$pn = $projectName !== '' ? $projectName : $projectType;

$ins = $db->prepare(
    'INSERT INTO ai_chat_analysis
    (userID, message, aiResponse, confidenceScore, project_name, location_label, cluster_val, suitability_label, score_val)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
$ins->bind_param(
    'issdssisd',
    $userId,
    $message,
    $aiResponse,
    $confidence,
    $pn,
    $location,
    $cluster,
    $suitability,
    $score
);
$ins->execute();
$ins->close();

locateiq_json_response(200, [
    'cluster' => $cluster,
    'suitability' => $suitability,
    'score' => $score,
    'latitude' => round($latOut, 6),
    'longitude' => round($lngOut, 6),
]);
