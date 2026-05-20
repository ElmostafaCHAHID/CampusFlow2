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
        Schema::table('articles', function (Blueprint $table) {
            if (! Schema::hasColumn('articles', 'video')) {
                $table->string('video')->nullable()->after('cover_image');
            }
            if (! Schema::hasColumn('articles', 'audio')) {
                $table->string('audio')->nullable()->after('video');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (Schema::hasColumn('articles', 'audio')) {
                $table->dropColumn('audio');
            }
            if (Schema::hasColumn('articles', 'video')) {
                $table->dropColumn('video');
            }
        });
    }
};
