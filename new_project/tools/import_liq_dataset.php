<?php
/**
 * One-time import: loads ml/Data/LocateIQ_Dataset_Final_rows.csv into liq_dataset.
 * Open in browser: http://localhost/LocateIQ/new_project/tools/import_liq_dataset.php
 * Remove or protect this file after import.
 */
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');

$root = dirname(__DIR__);
$csv = $root . '/ml/Data/LocateIQ_Dataset_Final_rows.csv';
if (!is_file($csv)) {
    echo "CSV not found: $csv\n";
    exit(1);
}

$cfg = require $root . '/api/includes/config.php';

$m = new mysqli($cfg['db_host'], $cfg['db_user'], $cfg['db_pass'], $cfg['db_name']);
if ($m->connect_error) {
    die('DB: ' . $m->connect_error);
}
$m->set_charset('utf8mb4');
$m->query('TRUNCATE TABLE liq_dataset');

$fh = fopen($csv, 'r');
$header = fgetcsv($fh);
$map = array_flip($header);
$n = 0;
$stmt = $m->prepare(
    'INSERT INTO liq_dataset (city, neighborhood, population_density, services_count, competitors_count, latitude, longitude)
     VALUES (?, ?, ?, ?, ?, ?, ?)'
);
while (($row = fgetcsv($fh)) !== false) {
    if (count($row) < 5) {
        continue;
    }
    $city = $row[$map['city']];
    $neigh = $row[$map['neighborhood']];
    $pd = (float) $row[$map['population_density']];
    $sv = (float) $row[$map['services_count']];
    $cp = (float) $row[$map['competitors_count']];
    $lat = isset($map['latitude']) && $row[$map['latitude']] !== '' ? (float) $row[$map['latitude']] : 0.0;
    $lng = isset($map['longitude']) && $row[$map['longitude']] !== '' ? (float) $row[$map['longitude']] : 0.0;
    $stmt->bind_param('ssddddd', $city, $neigh, $pd, $sv, $cp, $lat, $lng);
    $stmt->execute();
    $n++;
}
$stmt->close();
fclose($fh);

echo "Imported $n rows into liq_dataset.\n";
