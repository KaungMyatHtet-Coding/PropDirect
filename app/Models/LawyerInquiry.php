<?php

namespace App\Models;

use App\Services\MyanmarFontService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LawyerInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'lawyer_profile_id',
        'lawyer_user_id',
        'client_id',
        'property_id',
        'service_type',
        'preferred_date',
        'quoted_fee',
        'notes',
        'lawyer_response',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'preferred_date' => 'date',
            'quoted_fee' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (LawyerInquiry $inquiry) {
            if (! empty($inquiry->notes)) {
                $inquiry->notes = MyanmarFontService::normalizeToUnicode($inquiry->notes);
            }
            if (! empty($inquiry->lawyer_response)) {
                $inquiry->lawyer_response = MyanmarFontService::normalizeToUnicode($inquiry->lawyer_response);
            }
        });
    }

    public function lawyerProfile(): BelongsTo
    {
        return $this->belongsTo(LawyerProfile::class);
    }

    public function lawyerUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lawyer_user_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
