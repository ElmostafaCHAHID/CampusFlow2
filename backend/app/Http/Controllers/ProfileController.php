<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    /**
     * Display the authenticated user's profile.
     */
    public function show(User $user): JsonResponse
    {
        // Load and return profile with user and all relationships
        $profile = $user->profile ?? $user->profile()->create([]);

        // Load user relationship first, then followers and following on that user
        $profile->load('user');
        if ($profile->user) {
            $profile->user->load(['followers', 'following']);
        }

        return response()->json([
            'success' => true,
            'data' => $profile,
        ], 200);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(UpdateProfileRequest $request, User $user): JsonResponse
    {
        try {
            // Check authorization
            if (auth()->id() !== $user->id && !auth()->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this profile',
                ], 403);
            }

            $profile = $user->profile ?? $user->profile()->create([]);
            $validated = $request->validated();

            $profileData = [
                'bio' => $validated['bio'] ?? null,
                'linkedin_url' => $validated['linkedin_url'] ?? null,
                'github_url' => $validated['github_url'] ?? null,
                'portfolio_url' => $validated['portfolio_url'] ?? null,
            ];

            if ($request->file('avatar')) {
                $profileData['avatar'] = $request->file('avatar')->store('avatars', 'public');
            }

            $profile->update($profileData);

            // Refresh model to ensure URL accessors are up-to-date
            $profile->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $profile->load('user'),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Admin: List all users.
     */
    public function allUsers(): JsonResponse
    {
        $users = User::with('profile')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $users
        ], 200);
    }

    /**
     * Admin: Delete user.
     */
    public function deleteUser(User $user): JsonResponse
    {
        if ($user->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete admin user.'
            ], 403);
        }

        $user->delete();
        return response()->json([
            'success' => true,
            'message' => 'User account deleted successfully.'
        ], 200);
    }

    /**
     * Admin: Dashboard stats.
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'total_articles' => \App\Models\Article::count(),
                'total_comments' => \App\Models\Comment::count(),
                'total_categories' => \App\Models\Category::count(),
            ]
        ], 200);
    }
}
