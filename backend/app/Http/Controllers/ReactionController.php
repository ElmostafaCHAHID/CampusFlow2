<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Reaction;
use App\Models\Notification;
use App\Helpers\BroadcastHelper;
use Illuminate\Http\JsonResponse;

class ReactionController extends Controller
{
    /**
     * Like an article.
     */
    public function like(Article $article): JsonResponse
    {
        try {
            $reaction = Reaction::firstOrCreate(
                [
                    'user_id' => auth()->id(),
                    'article_id' => $article->id,
                ],
                [
                    'type' => 'like',
                ]
            );

            $message = $reaction->wasRecentlyCreated ? 'Article liked successfully' : 'Already liked';

            if ($reaction->wasRecentlyCreated && $article->user_id !== auth()->id()) {
                $notificationMsg = auth()->user()->name . " liked your article: " . $article->title;
                $notification = Notification::create([
                    'user_id' => $article->user_id,
                    'message' => $notificationMsg,
                ]);

                BroadcastHelper::broadcastNotification(
                    $article->user_id,
                    $notificationMsg,
                    $notification
                );
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $reaction,
            ], $reaction->wasRecentlyCreated ? 201 : 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to like article',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Unlike an article.
     */
    public function unlike(Article $article): JsonResponse
    {
        try {
            Reaction::where('user_id', auth()->id())
                ->where('article_id', $article->id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Article unliked successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to unlike article',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get likes count for an article.
     */
    public function getLikes(Article $article): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'likes_count' => $article->reactions()->count(),
                'liked_by_user' => $article->reactions()->where('user_id', auth()->id())->exists(),
            ],
        ], 200);
    }
}
