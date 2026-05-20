<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles.
     */
    public function index(): JsonResponse
    {
        $query = Article::with('user', 'category', 'comments', 'reactions');

        // Allow filtering by user_id (used by frontend profile page)
        if (request()->has('user_id') && request()->get('user_id')) {
            $userId = (int) request()->get('user_id');
            $query->where('user_id', $userId);
        }

        // paginate() returns: { data: [...], current_page, last_page, ... }
        $paginated = $query->paginate(15);

        // Wrap paginated response for consistency
        return response()->json([
            'success' => true,
            'data' => $paginated,
        ], 200);
    }

    /**
     * Store a newly created article.
     */
    public function store(StoreArticleRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Generate a unique slug to avoid UNIQUE constraint violation
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;
            while (Article::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $article = Article::create([
                'user_id'     => auth()->id(),
                'category_id' => $validated['category_id'],
                'title'       => $validated['title'],
                'slug'        => $slug,
                'body'        => $validated['body'],
                'cover_image' => $request->file('cover_image')
                    ? $request->file('cover_image')->store('articles', 'public')
                    : null,
                'video' => $request->file('video')
                    ? $request->file('video')->store('articles', 'public')
                    : null,
                'audio' => $request->file('audio')
                    ? $request->file('audio')->store('articles', 'public')
                    : null,
            ]);

            // Refresh to ensure appended accessors (URLs) are populated
            $article->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Article created successfully',
                'data'    => $article->load('user', 'category'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create article: ' . $e->getMessage(),
                'error'   => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified article.
     */
    public function show(Article $article): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $article->load('user', 'category', 'comments.user', 'reactions.user', 'savers')
                             ->append('cover_image_url', 'video_url', 'audio_url'),
        ], 200);
    }

    /**
     * Update the specified article.
     */
    public function update(UpdateArticleRequest $request, Article $article): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Check authorization
            if (auth()->id() !== $article->user_id && !auth()->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this article',
                ], 403);
            }

            // Generate a unique slug, excluding the current article
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;
            while (Article::where('slug', $slug)->where('id', '!=', $article->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $article->update([
                'category_id' => $validated['category_id'],
                'title'       => $validated['title'],
                'slug'        => $slug,
                'body'        => $validated['body'],
                'cover_image' => $request->file('cover_image')
                    ? $request->file('cover_image')->store('articles', 'public')
                    : $article->cover_image,
                'video' => $request->file('video')
                    ? $request->file('video')->store('articles', 'public')
                    : ($article->video ?? null),
                'audio' => $request->file('audio')
                    ? $request->file('audio')->store('articles', 'public')
                    : ($article->audio ?? null),
            ]);

            // Refresh model to ensure appended accessors are up-to-date
            $article->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Article updated successfully',
                'data'    => $article->load('user', 'category'),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update article: ' . $e->getMessage(),
                'error'   => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified article.
     */
    public function destroy(Article $article): JsonResponse
    {
        try {
            // Check authorization
            if (auth()->id() !== $article->user_id && !auth()->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to delete this article',
                ], 403);
            }

            $article->delete();

            return response()->json([
                'success' => true,
                'message' => 'Article deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete article',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
