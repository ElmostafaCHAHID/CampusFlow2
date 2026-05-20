<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;

$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$email = 'admin@mostafa.com';
$password = 'Most@f@2026';

echo "Looking for admin: $email\n";
$user = User::where('email', $email)->first();

if (!$user) {
    echo "Creating new admin user...\n";
    $user = User::create([
        'name' => 'Mostafa Admin',
        'email' => $email,
        'password' => Hash::make($password),
        'role' => 'admin',
    ]);
    echo "Admin created. ID: " . $user->id . "\n";
} else {
    echo "Updating existing admin user role and password...\n";
    $user->update([
        'role' => 'admin',
        'password' => Hash::make($password),
    ]);
    echo "Admin updated. ID: " . $user->id . "\n";
}

// Ensure profile exists
Profile::updateOrCreate(
    ['user_id' => $user->id],
    ['bio' => 'System administrator for CampusFlow.']
);

echo "Admin Profile ensured.\n";
echo "SUCCESS: Admin should be able to log in with $email / $password\n";
