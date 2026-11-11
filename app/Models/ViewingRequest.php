<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ViewingRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'seeker_id',
        'owner_id',
        'preferred_date',
        'preferred_time',
        'message',
        'status',
        'contact_unlocked',
    ];

    protected function casts(): array
    {
        return [
            'preferred_date' => 'date',
            'contact_unlocked' => 'boolean',
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function seeker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seeker_id');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
