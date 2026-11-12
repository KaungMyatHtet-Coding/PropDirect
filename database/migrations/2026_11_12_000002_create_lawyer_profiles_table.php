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
        Schema::create('lawyer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('license_number')->unique();
            $table->enum('lawyer_type', ['advocate', 'higher_grade_pleader']);
            $table->string('degree');
            $table->unsignedInteger('experience_years')->default(1);
            $table->string('specialization');
            $table->decimal('consultation_fee', 12, 2)->default(0);
            $table->decimal('contract_fee', 12, 2)->default(0);
            $table->text('bio');
            $table->string('license_card_image');
            $table->string('office_township');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_remark')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lawyer_profiles');
    }
};
