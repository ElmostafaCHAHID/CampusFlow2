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
    $out = "Migrations and seeding completed successfully.\n";
    $out .= \Illuminate\Support\Facades\Artisan::output();
    file_put_contents(__DIR__.'/out.txt', $out);
} catch (\Exception $e) {
    file_put_contents(__DIR__.'/out.txt', "Error: " . $e->getMessage() . "\n");
}
