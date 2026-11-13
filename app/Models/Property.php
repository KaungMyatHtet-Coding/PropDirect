<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'title',
        'slug',
        'description',
        'listing_type',
        'property_type',
        'price',
        'security_deposit',
        'township',
        'city',
        'address',
        'bedrooms',
        'bathrooms',
        'width_ft',
        'length_ft',
        'area_sqft',
        'floor_level',
        'toilet_type',
        'aircon_count',
        'flooring_type',
        'amenities',
        'house_rules',
        'min_contract_months',
        'advance_payment_months',
        'ownership_type',
        'status',
        'images',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'security_deposit' => 'decimal:2',
            'width_ft' => 'decimal:2',
            'length_ft' => 'decimal:2',
            'area_sqft' => 'integer',
            'bedrooms' => 'integer',
            'bathrooms' => 'integer',
            'aircon_count' => 'integer',
            'min_contract_months' => 'integer',
            'advance_payment_months' => 'integer',
            'amenities' => 'array',
            'house_rules' => 'array',
            'images' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Property $property) {
            if ($property->width_ft && $property->length_ft) {
                $property->area_sqft = (int) round($property->width_ft * $property->length_ft);
            }
        });
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function viewingRequests(): HasMany
    {
        return $this->hasMany(ViewingRequest::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function lawyerInquiries(): HasMany
    {
        return $this->hasMany(LawyerInquiry::class);
    }
}
