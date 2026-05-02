<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';

/**
 * Run ml/predict_cli.py with JSON on stdin; return decoded array or null on failure.
 */
function locateiq_ml_predict(float $pd, float $sv, float $cp): ?array
{
    $c = locateiq_config();
    $script = realpath(__DIR__ . '/../../ml/predict_cli.py');
    if ($script === false || !is_file($script)) {
        return null;
    }

    $payload = json_encode([
        'population_density' => $pd,
        'services_count' => $sv,
        'competitors_count' => $cp,
    ], JSON_UNESCAPED_UNICODE);

    $cmd = sprintf(
        '%s %s',
        escapeshellarg($c['python_cmd']),
        escapeshellarg($script)
    );

    $descriptorspec = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ];

    $proc = proc_open($cmd, $descriptorspec, $pipes, null, null);
    if (!is_resource($proc)) {
        return null;
    }

    fwrite($pipes[0], $payload);
    fclose($pipes[0]);
    $stdout = stream_get_contents($pipes[1]);
    fclose($pipes[1]);
    stream_get_contents($pipes[2]);
    fclose($pipes[2]);
    proc_close($proc);

    if ($stdout === false || trim($stdout) === '') {
        return null;
    }

    $out = json_decode(trim($stdout), true);
    return is_array($out) ? $out : null;
}

/**
 * Fallback when Python / models are missing (deterministic demo).
 */
function locateiq_ml_fallback(float $pd, float $sv, float $cp): array
{
    $score = min(100, max(0, ($pd / 5000) * 35 + ($sv / 60) * 40 + (1 - min($cp, 50) / 50) * 25));
    $score = round($score, 2);
    if ($score >= 65) {
        return [
            'cluster' => 2,
            'score' => $score,
            'suitability_ar' => 'مناسب جداً',
            'suitability_en' => 'Highly Suitable',
            'ok' => true,
        ];
    }
    if ($score >= 35) {
        return [
            'cluster' => 1,
            'score' => $score,
            'suitability_ar' => 'مناسب متوسط',
            'suitability_en' => 'Moderate',
            'ok' => true,
        ];
    }

    return [
        'cluster' => 0,
        'score' => $score,
        'suitability_ar' => 'غير مُوصى به',
        'suitability_en' => 'Not Recommended',
        'ok' => true,
    ];
}
