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
        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('width_ft', 8, 2)->default(15)->after('bathrooms');
            $table->decimal('length_ft', 8, 2)->default(60)->after('width_ft');
            $table->string('floor_level')->default('1st')->after('length_ft');
            $table->enum('toilet_type', ['western', 'squat', 'both'])->default('western')->after('floor_level');
            $table->integer('aircon_count')->default(0)->after('toilet_type');
            $table->enum('flooring_type', ['parquet', 'tiles', 'vinyl', 'cement_wood'])->default('tiles')->after('aircon_count');
            $table->json('amenities')->nullable()->after('flooring_type');
            $table->json('house_rules')->nullable()->after('amenities');
            $table->integer('min_contract_months')->nullable()->after('house_rules');
            $table->integer('advance_payment_months')->nullable()->after('min_contract_months');
            $table->string('ownership_type')->nullable()->after('advance_payment_months');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'width_ft',
                'length_ft',
                'floor_level',
                'toilet_type',
                'aircon_count',
                'flooring_type',
                'amenities',
                'house_rules',
                'min_contract_months',
                'advance_payment_months',
                'ownership_type',
            ]);
        });
    }
};
