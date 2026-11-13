<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'owner_id',
        'tenant_id',
        'viewing_request_id',
        'lawyer_inquiry_id',
        'contract_code',
        'start_date',
        'end_date',
        'monthly_rent',
        'deposit_amount',
        'rent_due_day',
        'current_version',
        'owner_signed_at',
        'tenant_signed_at',
        'activated_at',
        'termination_reason',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'monthly_rent' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'rent_due_day' => 'integer',
            'current_version' => 'integer',
            'owner_signed_at' => 'datetime',
            'tenant_signed_at' => 'datetime',
            'activated_at' => 'datetime',
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function viewingRequest(): BelongsTo
    {
        return $this->belongsTo(ViewingRequest::class);
    }

    public function lawyerInquiry(): BelongsTo
    {
        return $this->belongsTo(LawyerInquiry::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(ContractVersion::class)->orderBy('version_number', 'desc');
    }

    public function latestVersion(): HasOne
    {
        return $this->hasOne(ContractVersion::class)->latestOfMany('version_number');
    }

    public function rentPayments(): HasMany
    {
        return $this->hasMany(RentPayment::class)->orderBy('due_date', 'asc');
    }

    public function isSignedByOwner(): bool
    {
        return ! is_null($this->owner_signed_at);
    }

    public function isSignedByTenant(): bool
    {
        return ! is_null($this->tenant_signed_at);
    }

    public function isFullySigned(): bool
    {
        return $this->isSignedByOwner() && $this->isSignedByTenant();
    }
}
