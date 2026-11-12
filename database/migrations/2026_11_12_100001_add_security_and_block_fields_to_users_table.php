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
            $table->string('secondary_password')->nullable()->after('password');
            $table->boolean('is_blocked')->default(false)->after('is_profile_complete');
            $table->string('blocked_reason')->nullable()->after('is_blocked');
            $table->timestamp('blocked_at')->nullable()->after('blocked_reason');
            $table->timestamp('last_login_at')->nullable()->after('blocked_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'secondary_password',
                'is_blocked',
                'blocked_reason',
                'blocked_at',
                'last_login_at',
            ]);
        });
    }
};
