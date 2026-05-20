<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Follow;
use App\Models\Notification;
use App\Helpers\BroadcastHelper;
use Illuminate\Http\JsonResponse;

class FollowController extends Controller
{
    /**
     * Follow a user.
     */
    public function follow(User $user): JsonResponse
    {
        try {
            if (auth()->id() === $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot follow yourself',
                ], 400);
            }

            $follow = Follow::firstOrCreate([
                'follower_id' => auth()->id(),
                'followed_id' => $user->id,
            ]);

            $message = $follow->wasRecentlyCreated ? 'User followed successfully' : 'Already following';

            if ($follow->wasRecentlyCreated) {
                $notificationMsg = auth()->user()->name . " started following you!";
                $notification = Notification::create([
                    'user_id' => $user->id,
                    'message' => $notificationMsg,
                ]);

                BroadcastHelper::broadcastNotification(
                    $user->id,
                    $notificationMsg,
                    $notification
                );
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $follow,
            ], $follow->wasRecentlyCreated ? 201 : 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to follow user',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Unfollow a user.
     */
    public function unfollow(User $user): JsonResponse
    {
        try {
            Follow::where('follower_id', auth()->id())
                ->where('followed_id', $user->id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'User unfollowed successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to unfollow user',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get user followers.
     */
    public function getFollowers(User $user): JsonResponse
    {
        // Get followers without pagination to avoid issues
        $followers = $user->followers()->select('id', 'name', 'email')->get();

        return response()->json([
            'success' => true,
            'data' => $followers,
        ], 200);
    }

    /**
     * Get users that the user is following.
     */
    public function getFollowing(User $user): JsonResponse
    {
        // Get following without pagination to avoid issues
        $following = $user->following()->select('id', 'name', 'email')->get();

        return response()->json([
            'success' => true,
            'data' => $following,
        ], 200);
    }

    /**
     * Check if current authenticated user is following the given user.
     */
    public function isFollowing(User $user): JsonResponse
    {
        $me = auth()->user();
        if (! $me) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        $isFollowing = $me->following()->where('users.id', $user->id)->exists();

        return response()->json(['success' => true, 'data' => ['is_following' => $isFollowing]], 200);
    }
}
