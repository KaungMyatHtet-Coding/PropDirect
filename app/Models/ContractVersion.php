<?php

namespace App\Models;

use App\Services\MyanmarFontService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'version_number',
        'monthly_rent',
        'deposit_amount',
        'advance_payment_months',
        'rent_due_day',
        'start_date',
        'end_date',
        'terms_and_conditions',
        'house_rules_snapshot',
        'revision_request_note',
        'structured_clauses',
        'change_summary',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'monthly_rent' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'advance_payment_months' => 'integer',
            'rent_due_day' => 'integer',
            'version_number' => 'integer',
            'house_rules_snapshot' => 'array',
            'structured_clauses' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (ContractVersion $version) {
            if (! empty($version->terms_and_conditions)) {
                $version->terms_and_conditions = MyanmarFontService::normalizeToUnicode($version->terms_and_conditions);
            }
            if (! empty($version->revision_request_note)) {
                $version->revision_request_note = MyanmarFontService::normalizeToUnicode($version->revision_request_note);
            }
            if (! empty($version->change_summary)) {
                $version->change_summary = MyanmarFontService::normalizeToUnicode($version->change_summary);
            }
        });
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
