<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SavedArticleController extends Controller
{
    // Save an article for the authenticated user
    public function save(Request $request, Article $article): JsonResponse
    {
        $user = $request->user();
        $user->savedArticles()->syncWithoutDetaching([$article->id]);

        return response()->json(['success' => true, 'message' => 'Article saved', 'data' => $article], 201);
    }

    // Unsave an article
    public function unsave(Request $request, Article $article): JsonResponse
    {
        $user = $request->user();
        $user->savedArticles()->detach($article->id);

        return response()->json(['success' => true, 'message' => 'Article unsaved'], 200);
    }

    // Get saved articles for a user
    public function savedForUser(User $user): JsonResponse
    {
        $saved = $user->savedArticles()->with('user', 'category')->paginate(20);
        return response()->json(['success' => true, 'data' => $saved], 200);
    }
}
