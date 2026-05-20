<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MediaUploadController;
use App\Http\Controllers\SavedArticleController;

// Public Routes
Route::get('/login', function () {
    return response()->json([
        'success' => false,
        'message' => 'This endpoint requires POST. Send email and password in a JSON POST request to /api/login.',
    ], 405);
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/categories', [CategoryController::class, 'index']); // Public category listing

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // 🔹 CURRENT AUTHENTICATED USER
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);

    // Articles Routes
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::post('/articles/media', [MediaUploadController::class, 'upload']);
    Route::get('/articles/{article}', [ArticleController::class, 'show']);
    Route::put('/articles/{article}', [ArticleController::class, 'update']);
    // Accept POST as well for multipart/form-data updates (method override compatibility)
    Route::post('/articles/{article}', [ArticleController::class, 'update']);
    Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);

    // Admin-Only Routes
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        // Admin Management
        Route::get('/admin/users', [ProfileController::class, 'allUsers']);
        Route::delete('/admin/users/{user}', [ProfileController::class, 'deleteUser']);
        Route::get('/admin/stats', [ProfileController::class, 'stats']);
    });

    Route::get('/categories/{category}', [CategoryController::class, 'show']);

    // Comments Routes
    Route::post('/articles/{article}/comments', [CommentController::class, 'store']);
    Route::delete('/articles/{article}/comments/{comment}', [CommentController::class, 'destroy']);

    // Reactions Routes (Likes)
    Route::post('/articles/{article}/like', [ReactionController::class, 'like']);
    // Some clients prefer DELETE for unlike
    Route::delete('/articles/{article}/like', [ReactionController::class, 'unlike']);
    Route::get('/articles/{article}/likes', [ReactionController::class, 'getLikes']);

    // Follow Routes
    Route::post('/follow/{user}', [FollowController::class, 'follow']);
    Route::delete('/follow/{user}', [FollowController::class, 'unfollow']);
    Route::get('/users/{user}/followers', [FollowController::class, 'getFollowers']);
    Route::get('/users/{user}/following', [FollowController::class, 'getFollowing']);
    Route::get('/users/{user}/is-following', [FollowController::class, 'isFollowing']);

    // Profile Routes
    Route::get('/users/{user}/profile', [ProfileController::class, 'show']);
    Route::put('/users/{user}/profile', [ProfileController::class, 'update']);
    // Accept POST for profile updates with file uploads (method override compatibility)
    Route::post('/users/{user}/profile', [ProfileController::class, 'update']);

    // Notifications Routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    // Saved Articles
    Route::post('/articles/{article}/save', [SavedArticleController::class, 'save']);
    Route::delete('/articles/{article}/save', [SavedArticleController::class, 'unsave']);
    Route::get('/users/{user}/saved-articles', [SavedArticleController::class, 'savedForUser']);

    // Chat Routes
    Route::get('/conversations', [ChatController::class, 'conversations']);
    Route::get('/messages/{user}', [ChatController::class, 'messagesWith']);
    Route::post('/messages', [ChatController::class, 'sendMessage']);
});
