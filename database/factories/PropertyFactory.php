<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Property>
 */
class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        $title = fake()->sentence(4);
        $width = 15;
        $length = 60;

        return [
            'owner_id' => User::factory()->state(['role' => 'owner', 'is_verified_owner' => true]),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->numerify('###'),
            'description' => fake()->paragraph(),
            'listing_type' => 'rent',
            'property_type' => 'apartment',
            'price' => 400000,
            'security_deposit' => 400000,
            'township' => 'Sanchaung',
            'city' => 'Yangon',
            'address' => 'Sanchaung, Yangon',
            'width_ft' => $width,
            'length_ft' => $length,
            'area_sqft' => $width * $length,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'floor_level' => '2nd',
            'toilet_type' => 'western',
            'aircon_count' => 2,
            'flooring_type' => 'parquet',
            'amenities' => ['lift', 'generator', 'water_heater'],
            'house_rules' => ['no_pets'],
            'min_contract_months' => 6,
            'advance_payment_months' => 3,
            'ownership_type' => 'bcc_ready',
            'status' => 'available',
            'images' => ['properties/sanchaung_apt_1.png'],
        ];
    }
}
