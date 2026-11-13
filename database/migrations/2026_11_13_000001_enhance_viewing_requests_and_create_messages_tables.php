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
        Schema::table('viewing_requests', function (Blueprint $table) {
            $table->date('rescheduled_date')->nullable()->after('preferred_time');
            $table->string('rescheduled_time')->nullable()->after('rescheduled_date');
            $table->text('owner_note')->nullable()->after('rescheduled_time');
            $table->string('status', 30)->default('pending')->change();
        });

        Schema::create('viewing_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('viewing_request_id')->constrained('viewing_requests')->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('viewing_messages');

        Schema::table('viewing_requests', function (Blueprint $table) {
            $table->dropColumn(['rescheduled_date', 'rescheduled_time', 'owner_note']);
        });
    }
};
