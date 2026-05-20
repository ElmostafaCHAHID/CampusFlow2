<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\User;
use App\Models\Profile;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Hash;

$app->make(Kernel::class)->bootstrap();

$email = 'admin@mostafa.com';
$password = 'Most@f@2026';

// Delete any existing admin user with this email to start fresh
$existing = User::where('email', $email)->first();
if ($existing) {
    // Delete tokens so we can cleanly recreate
    $existing->tokens()->delete();
    // Delete profile if exists
    if ($existing->profile) {
        $existing->profile->delete();
    }
    $existing->delete();
    echo "Deleted existing admin user.\n";
}

// Create fresh admin user and hash the password explicitly for safety
$admin = User::create([
    'name' => 'Mostafa Admin',
    'email' => $email,
    'password' => Hash::make($password),
    'role' => 'admin',
]);

// Create profile (only use fillable fields: user_id, bio, avatar, linkedin_url, github_url, portfolio_url)
Profile::create([
    'user_id' => $admin->id,
    'bio' => 'System administrator for CampusFlow.',
]);

echo "=== Admin user created successfully ===\n";
echo "ID: " . $admin->id . "\n";
echo "Email: " . $admin->email . "\n";
echo "Role: " . $admin->role . "\n";
echo "Password hash starts with: " . substr($admin->password, 0, 10) . "...\n";

// Verify login works
$verified = \Illuminate\Support\Facades\Hash::check('Most@f@2026', $admin->password);
echo "Password verification: " . ($verified ? "SUCCESS" : "FAILED") . "\n";
