<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingMinuteReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_minute_id',
        'user_id',
        'comment',
        'status',
    ];

    public function minute(): BelongsTo
    {
        return $this->belongsTo(MeetingMinute::class, 'meeting_minute_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
