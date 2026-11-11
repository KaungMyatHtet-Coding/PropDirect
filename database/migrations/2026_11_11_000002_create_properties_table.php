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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('listing_type', ['rent', 'sale']);
            $table->enum('property_type', ['apartment', 'condo', 'office', 'shop', 'house']);
            $table->decimal('price', 15, 2);
            $table->decimal('security_deposit', 15, 2)->nullable();
            $table->string('township');
            $table->string('city')->default('Yangon');
            $table->string('address');
            $table->integer('bedrooms')->default(1);
            $table->integer('bathrooms')->default(1);
            $table->integer('area_sqft')->default(0);
            $table->enum('status', ['available', 'booked', 'rented', 'sold'])->default('available');
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
