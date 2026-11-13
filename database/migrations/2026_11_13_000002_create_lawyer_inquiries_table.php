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
        Schema::create('lawyer_inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lawyer_profile_id')->constrained('lawyer_profiles')->cascadeOnDelete();
            $table->foreignId('lawyer_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('property_id')->nullable()->constrained('properties')->nullOnDelete();
            $table->enum('service_type', [
                'grant_verification',
                'sale_contract',
                'lease_contract',
                'newspaper_notice',
                'general_consultation',
            ]);
            $table->date('preferred_date');
            $table->decimal('quoted_fee', 12, 2)->nullable();
            $table->text('notes');
            $table->text('lawyer_response')->nullable();
            $table->enum('status', ['pending', 'accepted', 'completed', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lawyer_inquiries');
    }
};
