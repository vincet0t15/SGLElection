<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Backfill voter_id for existing candidates
        $candidates = DB::table('candidates')->whereNull('voter_id')->get();

        foreach ($candidates as $candidate) {
            $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $candidate->name)) . rand(100, 999);
            // Ensure uniqueness
            while (DB::table('voters')->where('username', $username)->exists()) {
                $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $candidate->name)) . rand(100, 999);
            }

            $voterId = DB::table('voters')->insertGetId([
                'name' => $candidate->name,
                'username' => $username,
                'password' => Hash::make('password'),
                'lrn_number' => null, // Or some default
                'year_level_id' => $candidate->year_level_id,
                'year_section_id' => $candidate->year_section_id,
                'event_id' => $candidate->event_id,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('candidates')->where('id', $candidate->id)->update(['voter_id' => $voterId]);
        }

        // 2. Drop columns
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropForeign(['year_level_id']);
            $table->dropForeign(['year_section_id']);
            $table->dropColumn(['name', 'year_level_id', 'year_section_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->string('name')->nullable(); // Made nullable initially to populate
            $table->foreignId('year_level_id')->nullable()->constrained('year_levels')->onDelete('cascade');
            $table->foreignId('year_section_id')->nullable()->constrained('year_sections')->onDelete('cascade');
        });

        // Restore data from voters
        $candidates = DB::table('candidates')->whereNotNull('voter_id')->get();
        foreach ($candidates as $candidate) {
            $voter = DB::table('voters')->where('id', $candidate->voter_id)->first();
            if ($voter) {
                DB::table('candidates')->where('id', $candidate->id)->update([
                    'name' => $voter->name,
                    'year_level_id' => $voter->year_level_id,
                    'year_section_id' => $voter->year_section_id,
                ]);
            }
        }

        // Make columns required again if needed, but sqlite/mysql limitations might apply to modify column.
        // For now, nullable is safer for rollback or we can assume data exists.
        // DB::statement("ALTER TABLE candidates MODIFY name VARCHAR(255) NOT NULL");
    }
};
