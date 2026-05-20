<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@mostafa.com'],
            [
                'name' => 'Mostafa Admin',
                'password' => Hash::make('Most@f@2026'),
                'role' => 'admin',
            ]
        );

        // Ensure the admin has a profile
        Profile::updateOrCreate(
            ['user_id' => $admin->id],
            [
                'bio' => 'System administrator for CampusFlow.',
            ]
        );
    }
}
