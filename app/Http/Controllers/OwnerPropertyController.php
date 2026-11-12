<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Services\MyanmarFontService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OwnerPropertyController extends Controller
{
    /**
     * Display owner's properties.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $properties = Property::where('owner_id', $user->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Owner/Properties/Index', [
            'properties' => $properties,
        ]);
    }

    /**
     * Show form to create a new property.
     */
    public function create(): Response
    {
        return Inertia::render('Owner/Properties/Create');
    }

    /**
     * Store newly created property listing.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Ensure user is verified owner or admin
        if (! ($user->isAdmin() || ($user->isOwner() && $user->is_verified_owner))) {
            return redirect()->route('owner.verification.index')
                ->with('error', 'Only verified property owners can post property listings.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:20'],
            'listing_type' => ['required', 'in:rent,sale'],
            'property_type' => ['required', 'in:apartment,condo,house,office,shop'],
            'price' => ['required', 'numeric', 'min:10000'],
            'security_deposit' => ['nullable', 'numeric', 'min:0'],
            'township' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:500'],
            'bedrooms' => ['required', 'integer', 'min:0', 'max:20'],
            'bathrooms' => ['required', 'integer', 'min:1', 'max:10'],
            'width_ft' => ['required', 'numeric', 'min:5', 'max:200'],
            'length_ft' => ['required', 'numeric', 'min:10', 'max:500'],
            'floor_level' => ['required', 'string', 'max:50'],
            'toilet_type' => ['required', 'in:western,squat,both'],
            'aircon_count' => ['required', 'integer', 'min:0', 'max:20'],
            'flooring_type' => ['required', 'in:parquet,tiles,vinyl,cement_wood'],
            'amenities' => ['nullable', 'array'],
            'house_rules' => ['nullable', 'array'],
            'min_contract_months' => ['nullable', 'integer', 'min:1', 'max:36'],
            'advance_payment_months' => ['nullable', 'integer', 'min:1', 'max:12'],
            'ownership_type' => ['nullable', 'string', 'max:100'],
            'images' => ['required', 'array', 'min:1', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        // Normalize Zawgyi to Unicode for clean persistence
        $titleUnicode = MyanmarFontService::normalizeToUnicode($validated['title']);
        $descUnicode = MyanmarFontService::normalizeToUnicode($validated['description']);
        $addressUnicode = MyanmarFontService::normalizeToUnicode($validated['address']);

        // Generate unique slug
        $baseSlug = Str::slug($titleUnicode);
        if (empty($baseSlug)) {
            $baseSlug = 'property-' . Str::lower($validated['township']);
        }
        $slug = $baseSlug . '-' . Str::random(6);

        // Upload images
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $imagePaths[] = $file->store('properties', 'public');
            }
        }

        $areaSqft = (int) round($validated['width_ft'] * $validated['length_ft']);

        $property = Property::create([
            'owner_id' => $user->id,
            'title' => $titleUnicode,
            'slug' => $slug,
            'description' => $descUnicode,
            'listing_type' => $validated['listing_type'],
            'property_type' => $validated['property_type'],
            'price' => $validated['price'],
            'security_deposit' => $validated['security_deposit'] ?? null,
            'township' => $validated['township'],
            'city' => 'Yangon',
            'address' => $addressUnicode,
            'bedrooms' => $validated['bedrooms'],
            'bathrooms' => $validated['bathrooms'],
            'width_ft' => $validated['width_ft'],
            'length_ft' => $validated['length_ft'],
            'area_sqft' => $areaSqft,
            'floor_level' => $validated['floor_level'],
            'toilet_type' => $validated['toilet_type'],
            'aircon_count' => $validated['aircon_count'],
            'flooring_type' => $validated['flooring_type'],
            'amenities' => $validated['amenities'] ?? [],
            'house_rules' => $validated['house_rules'] ?? [],
            'min_contract_months' => $validated['min_contract_months'] ?? null,
            'advance_payment_months' => $validated['advance_payment_months'] ?? null,
            'ownership_type' => $validated['ownership_type'] ?? null,
            'status' => 'available',
            'images' => $imagePaths,
        ]);

        return redirect()->route('properties.show', $property->slug)
            ->with('success', 'Your direct property listing is now live with Verified Owner status!');
    }
}
