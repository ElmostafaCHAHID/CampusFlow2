<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Profile;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Hash;

$app->make(Kernel::class)->bootstrap();

$email = 'admin2@mostafa.com';
$password = 'AdminTwo@2026';

$admin = User::updateOrCreate(
    ['email' => $email],
    [
        'name' => 'Second Admin',
        'password' => Hash::make($password),
        'role' => 'admin',
    ]
);

Profile::updateOrCreate(
    ['user_id' => $admin->id],
    ['bio' => 'Secondary administrator account for CampusFlow.']
);

echo "Secondary admin user created or updated successfully.\n";
echo "Email: $email\n";
echo "Password: $password\n";
echo "Now log in through the frontend at http://localhost:3000/login with these credentials.\n";
