<?php
/**
 * Copy to config.local.php and override credentials if needed.
 */
$cfg = [
    'db_host' => '127.0.0.1',
    'db_name' => 'locateiq',
    'db_user' => 'root',
    'db_pass' => '',
    'python_cmd' => 'python',
];

if (is_file(__DIR__ . '/config.local.php')) {
    $local = include __DIR__ . '/config.local.php';
    if (is_array($local)) {
        $cfg = array_merge($cfg, $local);
    }
}

return $cfg;
