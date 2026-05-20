<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

try {
    // Make sure tables exist
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);

    $admin = User::updateOrCreate(
        ['email' => 'admin@mostafa.com'],
        [
            'name' => 'Mostafa Admin',
            'password' => Hash::make('Most@f@2026'),
            'role' => 'admin',
        ]
    );

    Profile::updateOrCreate(
        ['user_id' => $admin->id],
        ['bio' => 'System administrator for CampusFlow']
    );

    $regularUser = User::updateOrCreate(
        ['email' => 'user@example.com'],
        [
            'name' => 'Test User',
            'password' => Hash::make('password123'),
            'role' => 'student',
        ]
    );

    Profile::updateOrCreate(
        ['user_id' => $regularUser->id],
        ['bio' => 'Standard user account for testing']
    );

    file_put_contents('seed_status.txt', 'SUCCESS: Seeded both admin@mostafa.com and user@example.com into sqlite db at ' . config('database.connections.sqlite.database'));

} catch (\Exception $e) {
    file_put_contents('seed_status.txt', 'ERROR: ' . $e->getMessage());
}
