<?php

namespace App\Http\Controllers;

use App\Models\LawyerProfile;
use App\Models\Property;
use App\Models\SearchLog;
use App\Services\MyanmarFontService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    /**
     * Display a public listing of properties with smart tolerance filters.
     */
    public function index(Request $request): Response
    {
        $rawSearch = $request->query('search', '');
        $search = MyanmarFontService::normalizeToUnicode($rawSearch);
        $listingType = $request->query('listing_type', 'all');
        $propertyType = $request->query('property_type', 'all');
        $township = $request->query('township', 'all');
        $floorLevel = $request->query('floor_level', 'all');
        $targetPrice = (float) $request->query('target_price', 0);
        $priceTolerance = $request->boolean('price_tolerance', true);
        $minPrice = $request->query('min_price');
        $maxPrice = $request->query('max_price');

        // Dimension filters
        $dimensionPreset = $request->query('dimension_preset', 'all');
        $dimTolerance = $request->boolean('dim_tolerance', true);

        // Facility filters
        $toiletType = $request->query('toilet_type', 'all');
        $minAircon = (int) $request->query('min_aircon', 0);
        $flooringType = $request->query('flooring_type', 'all');
        $amenity = $request->query('amenity', 'all');

        $query = Property::with('owner:id,name,phone,avatar,role,is_verified_owner')
            ->where('status', 'available');

        // 1. Keyword Search (Zawgyi-to-Unicode normalized)
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('township', 'like', "%{$search}%");
            });
        }

        // 2. Listing Type
        if (in_array($listingType, ['rent', 'sale'], true)) {
            $query->where('listing_type', $listingType);
        }

        // 3. Property Type
        if ($propertyType !== 'all' && ! empty($propertyType)) {
            $query->where('property_type', $propertyType);
        }

        // 4. Township
        if ($township !== 'all' && ! empty($township)) {
            $query->where('township', 'like', "%{$township}%");
        }

        // 5. Floor Level
        if ($floorLevel !== 'all' && ! empty($floorLevel)) {
            $query->where('floor_level', $floorLevel);
        }

        // 6. Smart Price Filter with ±15% Tolerance
        if ($targetPrice > 0) {
            if ($priceTolerance) {
                $lower = $targetPrice * 0.85;
                $upper = $targetPrice * 1.15;
                $query->whereBetween('price', [$lower, $upper]);
            } else {
                $query->where('price', '<=', $targetPrice);
            }
        } elseif ($minPrice !== null && $maxPrice !== null && $minPrice !== '' && $maxPrice !== '') {
            $query->whereBetween('price', [(float) $minPrice, (float) $maxPrice]);
        } elseif ($minPrice !== null && $minPrice !== '') {
            $query->where('price', '>=', (float) $minPrice);
        } elseif ($maxPrice !== null && $maxPrice !== '') {
            $query->where('price', '<=', (float) $maxPrice);
        }

        // 7. Smart Dimension Filter with ±15% Tolerance
        $targetSqft = 0;
        if ($dimensionPreset === '12.5x50') $targetSqft = 625;
        elseif ($dimensionPreset === '15x60') $targetSqft = 900;
        elseif ($dimensionPreset === '20x60') $targetSqft = 1200;
        elseif ($dimensionPreset === '25x50') $targetSqft = 1250;
        elseif ($dimensionPreset === '40x60') $targetSqft = 2400;

        if ($targetSqft > 0) {
            if ($dimTolerance) {
                $lowerSqft = (int) round($targetSqft * 0.85);
                $upperSqft = (int) round($targetSqft * 1.15);
                $query->whereBetween('area_sqft', [$lowerSqft, $upperSqft]);
            } else {
                $query->where('area_sqft', '>=', $targetSqft);
            }
        }

        // 8. Facilities
        if (in_array($toiletType, ['western', 'squat', 'both'], true)) {
            if ($toiletType === 'western') {
                $query->whereIn('toilet_type', ['western', 'both']);
            } else {
                $query->where('toilet_type', $toiletType);
            }
        }

        if ($minAircon > 0) {
            $query->where('aircon_count', '>=', $minAircon);
        }

        if (in_array($flooringType, ['parquet', 'tiles', 'vinyl', 'cement_wood'], true)) {
            $query->where('flooring_type', $flooringType);
        }

        if ($amenity !== 'all' && ! empty($amenity)) {
            $query->whereJsonContains('amenities', $amenity);
        }

        // Record search log for market demand analytics if any filter is set
        if (($township !== 'all' && ! empty($township)) ||
            ! empty($listingType) ||
            ($dimensionPreset !== 'all' && ! empty($dimensionPreset)) ||
            ($floorLevel !== 'all' && ! empty($floorLevel)) ||
            $targetPrice > 0
        ) {
            SearchLog::create([
                'user_id' => auth()->id(),
                'township' => ($township !== 'all' && ! empty($township)) ? $township : null,
                'listing_type' => in_array($listingType, ['rent', 'sale'], true) ? $listingType : null,
                'dimension_preset' => ($dimensionPreset !== 'all' && ! empty($dimensionPreset)) ? $dimensionPreset : null,
                'floor_level' => ($floorLevel !== 'all' && ! empty($floorLevel)) ? $floorLevel : null,
                'target_price' => $targetPrice > 0 ? $targetPrice : null,
            ]);
        }

        $properties = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
            'filters' => [
                'search' => $rawSearch,
                'listing_type' => $listingType,
                'property_type' => $propertyType,
                'township' => $township,
                'floor_level' => $floorLevel,
                'target_price' => $targetPrice ?: '',
                'price_tolerance' => $priceTolerance,
                'min_price' => $minPrice ?: '',
                'max_price' => $maxPrice ?: '',
                'dimension_preset' => $dimensionPreset,
                'dim_tolerance' => $dimTolerance,
                'toilet_type' => $toiletType,
                'min_aircon' => $minAircon ?: '',
                'flooring_type' => $flooringType,
                'amenity' => $amenity,
            ],
        ]);
    }

    /**
     * Display single property details with rich specifications and verified lawyer sidebar.
     */
    public function show(string $slug): Response
    {
        $property = Property::with([
            'owner:id,name,phone,avatar,role,is_verified_owner,created_at',
        ])->where('slug', $slug)->firstOrFail();

        // Contact unlock check: owner, admin, or seeker with unlocked viewing request
        $user = auth()->user();
        $isUnlocked = false;
        if ($user) {
            if ($user->isAdmin() || $user->id === $property->owner_id) {
                $isUnlocked = true;
            } else {
                $isUnlocked = \App\Models\ViewingRequest::where('property_id', $property->id)
                    ->where('seeker_id', $user->id)
                    ->where('contact_unlocked', true)
                    ->exists();
            }
        }

        // Mask phone number for visitors without unlocked contact permission
        if (! $isUnlocked && $property->owner && $property->owner->phone) {
            $rawPhone = $property->owner->phone;
            $len = strlen($rawPhone);
            if ($len >= 7) {
                $property->owner->phone = substr($rawPhone, 0, 7) . str_repeat('*', max(0, $len - 7));
            } else {
                $property->owner->phone = substr($rawPhone, 0, 4) . '****';
            }
        }

        // Find verified lawyers nearby or featured
        $nearbyLawyers = LawyerProfile::with('user:id,name,phone,avatar,role')
            ->where('status', 'approved')
            ->where('office_township', $property->township)
            ->take(3)
            ->get();

        if ($nearbyLawyers->isEmpty()) {
            $nearbyLawyers = LawyerProfile::with('user:id,name,phone,avatar,role')
                ->where('status', 'approved')
                ->take(3)
                ->get();
        }

        return Inertia::render('Properties/Show', [
            'property' => $property,
            'nearbyLawyers' => $nearbyLawyers,
        ]);
    }
}
