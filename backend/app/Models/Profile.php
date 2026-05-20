<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bio',
        'avatar',
        'linkedin_url',
        'github_url',
        'portfolio_url',
    ];

    protected $appends = [
        'avatar_url',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Full URL for avatar stored on public disk.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (! $this->avatar) return null;
        return asset('storage/' . $this->avatar);
    }
}
