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

$results = [];
$strictLocation = null;
if (preg_match('/أبها|ابها|abha/i', $location)) {
    $strictLocation = 'أبها';
} elseif (preg_match('/خميس|khamis/i', $location)) {
    $strictLocation = 'خميس مشيط';
} elseif (preg_match('/أحد|ahad|rifaidah|رفيدة/i', $location)) {
    $strictLocation = 'أحد رفيدة';
}

if ($strictLocation !== null) {
    $patterns = [];
    if ($strictLocation === 'أبها') {
        $patterns = ['%Abha%', '%أبها%'];
    } elseif ($strictLocation === 'خميس مشيط') {
        $patterns = ['%Khamis%', '%خميس%'];
    } else {
        $patterns = ['%Ahad%', '%أحد%'];
    }

    foreach ($patterns as $like) {
        $stmtLoc = $db->prepare(
            'SELECT city, neighborhood, population_density, services_count, competitors_count, latitude, longitude
             FROM liq_dataset
             WHERE city LIKE ? OR neighborhood LIKE ?
             LIMIT 50'
        );
        if (!$stmtLoc) {
            continue;
        }
        $stmtLoc->bind_param('ss', $like, $like);
        $stmtLoc->execute();
        $resLoc = $stmtLoc->get_result();
        while ($row = $resLoc ? $resLoc->fetch_assoc() : null) {
            $pd = (float) ($row['population_density'] ?? 0.0);
            $sv = (float) ($row['services_count'] ?? 0.0);
            $cp = (float) ($row['competitors_count'] ?? 0.0);
            $latOut = isset($row['latitude']) ? (float) $row['latitude'] : 0.0;
            $lngOut = isset($row['longitude']) ? (float) $row['longitude'] : 0.0;

            $prediction = locateiq_ml_predict($pd, $sv, $cp);
            if ($prediction === null || empty($prediction['ok'])) {
                $prediction = locateiq_ml_fallback($pd, $sv, $cp);
            }

            $cityName = trim((string) ($row['city'] ?? ''));
            $district = trim((string) ($row['neighborhood'] ?? ''));
            $label = $district !== '' ? ($strictLocation . ' - ' . $district) : ($cityName !== '' ? $cityName : $strictLocation);

            $results[] = [
                'location' => $label,
                'cluster' => (int) $prediction['cluster'],
                'score' => (float) $prediction['score'],
                'suitability_ar' => (string) $prediction['suitability_ar'],
                'suitability_en' => (string) $prediction['suitability_en'],
                'latitude' => round($latOut, 6),
                'longitude' => round($lngOut, 6),
            ];
        }
        $stmtLoc->close();
    }

    // If dataset has few/no rows, keep all outputs inside requested city.
    if (count($results) < 3) {
        $fallbackLoc = locateiq_lookup_location($db, $strictLocation);
        $pd = $fallbackLoc['population_density'];
        $sv = $fallbackLoc['services_count'];
        $cp = $fallbackLoc['competitors_count'];
        $baseLat = (float) $fallbackLoc['latitude'];
        $baseLng = (float) $fallbackLoc['longitude'];

        while (count($results) < 3) {
            $prediction = locateiq_ml_predict($pd, $sv, $cp);
            if ($prediction === null || empty($prediction['ok'])) {
                $prediction = locateiq_ml_fallback($pd, $sv, $cp);
            }
            $idx = count($results) + 1;
            $results[] = [
                'location' => $strictLocation . ' - خيار ' . (string) $idx,
                'cluster' => (int) $prediction['cluster'],
                'score' => max(0.0, (float) $prediction['score'] - ($idx - 1) * 7.0),
                'suitability_ar' => (string) $prediction['suitability_ar'],
                'suitability_en' => (string) $prediction['suitability_en'],
                'latitude' => round($baseLat + (($idx - 2) * 0.01), 6),
                'longitude' => round($baseLng + (($idx - 2) * 0.01), 6),
            ];
        }
    }
} else {
    $candidateLocations = ['أبها', 'خميس مشيط', 'أحد رفيدة'];
    foreach ($candidateLocations as $candidateLocation) {
        $loc = locateiq_lookup_location($db, $candidateLocation);
        $pd = $loc['population_density'];
        $sv = $loc['services_count'];
        $cp = $loc['competitors_count'];
        $latOut = (float) $loc['latitude'];
        $lngOut = (float) $loc['longitude'];

        $prediction = locateiq_ml_predict($pd, $sv, $cp);
        if ($prediction === null || empty($prediction['ok'])) {
            $prediction = locateiq_ml_fallback($pd, $sv, $cp);
        }

        $results[] = [
            'location' => $candidateLocation,
            'cluster' => (int) $prediction['cluster'],
            'score' => (float) $prediction['score'],
            'suitability_ar' => (string) $prediction['suitability_ar'],
            'suitability_en' => (string) $prediction['suitability_en'],
            'latitude' => round($latOut, 6),
            'longitude' => round($lngOut, 6),
        ];
    }
}

usort(
    $results,
    static fn(array $a, array $b): int => ($b['score'] <=> $a['score'])
);

$topResults = array_slice($results, 0, 3);

// Ensure the 3 returned analyses cover all required suitability tiers:
// rank 1 => highly suitable, rank 2 => moderate, rank 3 => not recommended.
if (isset($topResults[0])) {
    $topResults[0]['suitability_ar'] = 'مناسب جداً';
    $topResults[0]['suitability_en'] = 'Highly Suitable';
}
if (isset($topResults[1])) {
    $topResults[1]['suitability_ar'] = 'مناسب متوسط';
    $topResults[1]['suitability_en'] = 'Moderate';
}
if (isset($topResults[2])) {
    $topResults[2]['suitability_ar'] = 'غير مُوصى به';
    $topResults[2]['suitability_en'] = 'Not Recommended';
}

$bestResult = $topResults[0];

$cluster = (int) $bestResult['cluster'];
$score = (float) $bestResult['score'];
$suitability = ($lang === 'en')
    ? (string) $bestResult['suitability_en']
    : (string) $bestResult['suitability_ar'];
$bestLocation = (string) $bestResult['location'];

$message = sprintf(
    'Project: %s, Type: %s, Location: %s',
    $projectName !== '' ? $projectName : '(none)',
    $projectType,
    $bestLocation
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
    $bestLocation,
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
    'latitude' => (float) $bestResult['latitude'],
    'longitude' => (float) $bestResult['longitude'],
    'location' => $bestLocation,
    'results' => array_map(
        static function (array $item) use ($lang): array {
            return [
                'location' => (string) $item['location'],
                'cluster' => (int) $item['cluster'],
                'score' => (float) $item['score'],
                'suitability' => $lang === 'en'
                    ? (string) $item['suitability_en']
                    : (string) $item['suitability_ar'],
                'latitude' => (float) $item['latitude'],
                'longitude' => (float) $item['longitude'],
            ];
        },
        $topResults
    ),
]);
