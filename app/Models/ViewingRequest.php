<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ViewingRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'seeker_id',
        'owner_id',
        'preferred_date',
        'preferred_time',
        'rescheduled_date',
        'rescheduled_time',
        'owner_note',
        'message',
        'status',
        'contact_unlocked',
    ];

    protected function casts(): array
    {
        return [
            'preferred_date' => 'date',
            'rescheduled_date' => 'date',
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

    public function messages(): HasMany
    {
        return $this->hasMany(ViewingMessage::class);
    }
}
