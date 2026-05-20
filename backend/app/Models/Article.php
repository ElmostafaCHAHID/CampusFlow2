<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'body',
        'cover_image',
        'video',
        'audio',
    ];

    protected $appends = [
        'comments_count',
        'likes_count',
        'author',
        'cover_image_url',
        'video_url',
        'audio_url',
    ];

    /**
     * Get the user that wrote the article.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category of the article.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the comments for the article.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the reactions for the article.
     */
    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    /**
     * Users who saved this article.
     */
    public function savers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_articles', 'article_id', 'user_id')->withTimestamps();
    }

    /**
     * Get comments count
     */
    public function getCommentsCountAttribute(): int
    {
        return $this->comments()->count();
    }

    /**
     * Get likes count
     */
    public function getLikesCountAttribute(): int
    {
        return $this->reactions()->count();
    }

    /**
     * Get author (alias for user)
     */
    public function getAuthorAttribute()
    {
        return $this->user;
    }

    /**
     * Full URL for cover image stored on public disk.
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        if (! $this->cover_image) return null;
        return asset('storage/' . $this->cover_image);
    }

    /**
     * Full URL for video file if present.
     */
    public function getVideoUrlAttribute(): ?string
    {
        if (! $this->video) return null;
        return asset('storage/' . $this->video);
    }

    /**
     * Full URL for audio file if present.
     */
    public function getAudioUrlAttribute(): ?string
    {
        if (! $this->audio) return null;
        return asset('storage/' . $this->audio);
    }
}
