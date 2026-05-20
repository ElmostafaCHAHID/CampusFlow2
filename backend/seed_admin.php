<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Profile;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Hash;

$app->make(Kernel::class)->bootstrap();

$email = 'admin@mostafa.com';
$password = 'Most@f@2026';

$admin = User::updateOrCreate(
    ['email' => $email],
    [
        'name' => 'Mostafa Admin',
        'password' => Hash::make($password),
        'role' => 'admin',
    ]
);

Profile::updateOrCreate(
    ['user_id' => $admin->id],
    ['bio' => 'System administrator for CampusFlow.']
);

echo "Admin user added/updated successfully.\n";
echo "Email: $email\n";
echo "Password: $password\n";
echo "Run the backend server and then POST to http://127.0.0.1:8000/api/login with these credentials.\n";
