<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'article_id',
        'type',
    ];

    /**
     * Get the user that made the reaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the article the reaction belongs to.
     */
    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
}
