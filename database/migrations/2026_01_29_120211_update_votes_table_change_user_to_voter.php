<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropUnique(['user_id', 'candidate_id']);
            $table->dropColumn('user_id');

            $table->foreignId('voter_id')->after('id')->constrained()->cascadeOnDelete();
            $table->unique(['voter_id', 'candidate_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            $table->dropForeign(['voter_id']);
            $table->dropUnique(['voter_id', 'candidate_id']);
            $table->dropColumn('voter_id');

            $table->foreignId('user_id')->after('id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'candidate_id']);
        });
    }
};
