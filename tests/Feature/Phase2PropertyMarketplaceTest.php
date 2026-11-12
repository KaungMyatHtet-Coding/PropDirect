<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class Phase2PropertyMarketplaceTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeker_cannot_access_owner_property_create(): void
    {
        $seeker = User::factory()->create(['role' => 'seeker', 'is_verified_owner' => false]);

        $response = $this->actingAs($seeker)->get('/owner/properties/create');
        $response->assertRedirect(route('owner.verification.index'));
    }

    public function test_verified_owner_can_access_property_create(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
            'is_verified_owner' => true,
        ]);

        $response = $this->actingAs($owner)->get('/owner/properties/create');
        $response->assertOk();
    }

    public function test_verified_owner_can_create_property_with_auto_area_sqft(): void
    {
        Storage::fake('public');

        $owner = User::factory()->create([
            'role' => 'owner',
            'is_verified_owner' => true,
        ]);

        $image = UploadedFile::fake()->image('living_room.jpg');

        $response = $this->actingAs($owner)->post('/owner/properties', [
            'title' => 'Nice Apartment in Sanchaung',
            'description' => 'Bright apartment near Padonmar park with lift.',
            'listing_type' => 'rent',
            'property_type' => 'apartment',
            'price' => 400000,
            'security_deposit' => 400000,
            'township' => 'Sanchaung',
            'address' => 'Padonmar Street, Sanchaung',
            'width_ft' => 15,
            'length_ft' => 60,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'floor_level' => '2nd',
            'toilet_type' => 'western',
            'aircon_count' => 2,
            'flooring_type' => 'parquet',
            'amenities' => ['lift', 'generator'],
            'house_rules' => ['no_pets'],
            'min_contract_months' => 6,
            'advance_payment_months' => 3,
            'ownership_type' => 'bcc_ready',
            'images' => [$image],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('properties', [
            'owner_id' => $owner->id,
            'township' => 'Sanchaung',
            'width_ft' => 15,
            'length_ft' => 60,
            'area_sqft' => 900,
            'listing_type' => 'rent',
        ]);
    }

    public function test_marketplace_filters_with_budget_tolerance(): void
    {
        $owner = User::factory()->create(['role' => 'owner', 'is_verified_owner' => true]);

        // Target: 400,000 MMK (4 Lakh)
        // ±15% range is 340,000 to 460,000
        $inRangeProp = Property::factory()->create([
            'owner_id' => $owner->id,
            'title' => 'Budget In-Range Condo',
            'price' => 380000,
            'listing_type' => 'rent',
        ]);

        $outRangeProp = Property::factory()->create([
            'owner_id' => $owner->id,
            'title' => 'Expensive Penthouse Out-of-Range',
            'price' => 600000,
            'listing_type' => 'rent',
        ]);

        $response = $this->get('/properties?target_price=400000');
        $response->assertOk();
        $response->assertSee('Budget In-Range Condo');
        $response->assertDontSee('Expensive Penthouse Out-of-Range');
    }

    public function test_property_details_masks_phone_for_public(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
            'phone' => '09111222333',
            'is_verified_owner' => true,
        ]);

        $property = Property::factory()->create([
            'owner_id' => $owner->id,
            'slug' => 'sanchaung-special-unit',
        ]);

        $response = $this->get("/properties/{$property->slug}");
        $response->assertOk();
        $response->assertSee('0911122****');
        $response->assertDontSee('09111222333');
    }
}
