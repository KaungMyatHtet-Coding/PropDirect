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
        'is_verified_owner',
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

    public function ownerVerification(): HasOne
    {
        return $this->hasOne(OwnerVerification::class)->latestOfMany();
    }

    public function ownerVerifications(): HasMany
    {
        return $this->hasMany(OwnerVerification::class);
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
