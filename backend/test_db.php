<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $pdo = \Illuminate\Support\Facades\DB::connection()->getPdo();
    $connected = true;
    $error = null;
} catch (Exception $e) {
    $connected = false;
    $error = $e->getMessage();
}

$data = [
    'default_connection' => config('database.default'),
    'env_db_connection' => env('DB_CONNECTION'),
    'env_db_host' => env('DB_HOST'),
    'has_cached_config' => file_exists(__DIR__.'/bootstrap/cache/config.php'),
    'connected' => $connected,
    'error' => $error
];

file_put_contents('db_debug2.json', json_encode($data, JSON_PRETTY_PRINT));
