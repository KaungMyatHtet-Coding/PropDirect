<?php

namespace App\Models;

use App\Services\MyanmarFontService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ViewingMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'viewing_request_id',
        'sender_id',
        'message',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (ViewingMessage $message) {
            if (! empty($message->message)) {
                $message->message = MyanmarFontService::normalizeToUnicode($message->message);
            }
        });
    }

    public function viewingRequest(): BelongsTo
    {
        return $this->belongsTo(ViewingRequest::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
