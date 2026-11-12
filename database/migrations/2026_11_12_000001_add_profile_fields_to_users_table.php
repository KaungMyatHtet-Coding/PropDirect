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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 30)->default('seeker')->change();
            $table->string('avatar')->nullable()->after('password');
            $table->string('occupation')->nullable()->after('avatar');
            $table->text('current_address')->nullable()->after('occupation');
            $table->string('nrc_number')->nullable()->after('current_address');
            $table->boolean('is_profile_complete')->default(false)->after('is_verified_owner');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar',
                'occupation',
                'current_address',
                'nrc_number',
                'is_profile_complete',
            ]);
            $table->enum('role', ['admin', 'owner', 'seeker'])->default('seeker')->change();
        });
    }
};
