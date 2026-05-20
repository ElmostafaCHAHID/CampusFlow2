<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Article;
use App\Models\Notification;
use App\Helpers\BroadcastHelper;
use App\Http\Requests\StoreCommentRequest;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    /**
     * Store a new comment on an article.
     */
    public function store(StoreCommentRequest $request, Article $article): JsonResponse
    {
        try {
            $validated = $request->validated();
            $comment = Comment::create([
                'user_id' => auth()->id(),
                'article_id' => $article->id,
                'content' => $validated['content'],
                'parent_id' => $validated['parent_id'] ?? null,
            ]);

            if ($comment->wasRecentlyCreated && $article->user_id !== auth()->id()) {
                $notificationMsg = auth()->user()->name . " commented on your article: " . $article->title;
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
                'message' => 'Comment created successfully',
                'data' => $comment->load('user'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create comment',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(Article $article, Comment $comment): JsonResponse
    {
        try {
            if ($comment->article_id !== $article->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Comment not found in this article',
                ], 404);
            }

            if (auth()->id() !== $comment->user_id && auth()->user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            $comment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Comment deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete comment',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
