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
        'area_sqft',
        'status',
        'images',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'security_deposit' => 'decimal:2',
            'images' => 'array',
            'bedrooms' => 'integer',
            'bathrooms' => 'integer',
            'area_sqft' => 'integer',
        ];
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
}
