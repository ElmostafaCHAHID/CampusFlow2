<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    \Illuminate\Support\Facades\Artisan::call('migrate:fresh', [
        '--seed' => true,
        '--force' => true,
    ]);
    file_put_contents('migrate_result.txt', "SUCCESS\n" . \Illuminate\Support\Facades\Artisan::output());
} catch (\Exception $e) {
    file_put_contents('migrate_result.txt', "ERROR\n" . $e->getMessage() . "\n" . $e->getTraceAsString());
}
