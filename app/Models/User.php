<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'avatar',
        'occupation',
        'current_address',
        'nrc_number',
        'is_verified_owner',
        'is_profile_complete',
        'telegram_chat_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified_owner' => 'boolean',
            'is_profile_complete' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    public function isSeeker(): bool
    {
        return $this->role === 'seeker';
    }

    public function isLawyer(): bool
    {
        return $this->role === 'lawyer';
    }

    /**
     * Automatically evaluate profile completion.
     * Profile is complete when avatar, phone, occupation, and current_address are set.
     */
    public function checkAndUpdateProfileCompletion(): bool
    {
        $complete = ! empty($this->avatar)
            && ! empty($this->phone)
            && ! empty($this->occupation)
            && ! empty($this->current_address);

        if ($this->is_profile_complete !== $complete) {
            $this->is_profile_complete = $complete;
            $this->save();
        }

        return $complete;
    }

    public function ownerVerification(): HasOne
    {
        return $this->hasOne(OwnerVerification::class)->latestOfMany();
    }

    public function ownerVerifications(): HasMany
    {
        return $this->hasMany(OwnerVerification::class);
    }

    public function lawyerProfile(): HasOne
    {
        return $this->hasOne(LawyerProfile::class);
    }

    public function reviewedVerifications(): HasMany
    {
        return $this->hasMany(OwnerVerification::class, 'reviewed_by');
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'owner_id');
    }

    public function viewingRequestsAsSeeker(): HasMany
    {
        return $this->hasMany(ViewingRequest::class, 'seeker_id');
    }

    public function viewingRequestsAsOwner(): HasMany
    {
        return $this->hasMany(ViewingRequest::class, 'owner_id');
    }

    public function contractsAsOwner(): HasMany
    {
        return $this->hasMany(Contract::class, 'owner_id');
    }

    public function contractsAsTenant(): HasMany
    {
        return $this->hasMany(Contract::class, 'tenant_id');
    }
}
