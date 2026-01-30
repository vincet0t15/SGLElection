<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Voter;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'ZYRUS VINCE B. FAMINI',
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Voter::create([
        //     'name' => 'ZYRUS VINCE B. FAMINI',
        //     'username' => 'voter',
        //     'password' => Hash::make('admin123'),
        //     'lrn_number' => '1234567890123',
        //     'year_level_id' => 1,
        //     'year_section_id' => 1,
        //     'is_active' => true,
        // ]);
    }
}
