<?php

declare(strict_types=1);

/**
 * إحداثيات تقريبية عند عدم وجود صف في liq_dataset
 *
 * @return array{0:float,1:float} lat, lng
 */
function locateiq_fallback_coords(string $locationHint): array
{
    if (strpos($locationHint, 'خميس') !== false) {
        return [18.3000, 42.7333];
    }
    if (strpos($locationHint, 'أحد') !== false) {
        return [18.2000, 42.9500];
    }

    return [18.2164, 42.5053];
}

/**
 * جلب مؤشرات الموقع + الإحداثيات من liq_dataset عند التطابق.
 *
 * @return array{
 *   population_density: float,
 *   services_count: float,
 *   competitors_count: float,
 *   latitude: float,
 *   longitude: float
 * }
 */
function locateiq_lookup_location(mysqli $db, string $locationHint): array
{
    $hint = trim($locationHint);
    $patterns = [];

    if ($hint !== '') {
        if (preg_match('/أبها|ابها|Abha/i', $hint)) {
            $patterns[] = '%Abha%';
            $patterns[] = '%أبها%';
        }
        if (preg_match('/خميس|Khamis/i', $hint)) {
            $patterns[] = '%Khamis%';
            $patterns[] = '%خميس%';
        }
        if (preg_match('/أحد|Ahad|Rufaidah|رفيدة/i', $hint)) {
            $patterns[] = '%Ahad%';
        }
        $patterns[] = '%' . substr($hint, 0, 120) . '%';
    }

    foreach ($patterns as $like) {
        $stmt = $db->prepare(
            'SELECT population_density, services_count, competitors_count, latitude, longitude
             FROM liq_dataset
             WHERE city LIKE ? OR neighborhood LIKE ?
             LIMIT 1'
        );
        if (!$stmt) {
            continue;
        }
        $stmt->bind_param('ss', $like, $like);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res ? $res->fetch_assoc() : null;
        $stmt->close();
        if ($row) {
            $lat = isset($row['latitude']) && $row['latitude'] !== null && $row['latitude'] !== ''
                ? (float) $row['latitude']
                : null;
            $lng = isset($row['longitude']) && $row['longitude'] !== null && $row['longitude'] !== ''
                ? (float) $row['longitude']
                : null;
            if ($lat === null || $lng === null) {
                [$lat, $lng] = locateiq_fallback_coords($hint ?: 'عسير');
            }

            return [
                'population_density' => (float) $row['population_density'],
                'services_count' => (float) $row['services_count'],
                'competitors_count' => (float) $row['competitors_count'],
                'latitude' => $lat,
                'longitude' => $lng,
            ];
        }
    }

    [$lat, $lng] = locateiq_fallback_coords($hint !== '' ? $hint : 'عسير');

    return [
        'population_density' => 2500.0,
        'services_count' => 35.0,
        'competitors_count' => 25.0,
        'latitude' => $lat,
        'longitude' => $lng,
    ];
}

/**
 * @return array{0:float,1:float,2:float} population_density, services_count, competitors_count
 */
function locateiq_lookup_features(mysqli $db, string $locationHint): array
{
    $loc = locateiq_lookup_location($db, $locationHint);

    return [
        $loc['population_density'],
        $loc['services_count'],
        $loc['competitors_count'],
    ];
}
