<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user only if it doesn't exist
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password123'),
            ]
        );

        // Create default categories
        $categories = [
            ['name' => 'Technology', 'slug' => 'technology'],
            ['name' => 'Science', 'slug' => 'science'],
            ['name' => 'Arts', 'slug' => 'arts'],
            ['name' => 'Sports', 'slug' => 'sports'],
            ['name' => 'Business', 'slug' => 'business'],
            ['name' => 'Education', 'slug' => 'education'],
            ['name' => 'Entertainment', 'slug' => 'entertainment'],
            ['name' => 'Lifestyle', 'slug' => 'lifestyle'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['name' => $category['name']],
                ['slug' => $category['slug']]
            );
        }

        // Run AdminUserSeeder
        $this->call(AdminUserSeeder::class);
    }
}
