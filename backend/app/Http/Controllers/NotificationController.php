<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user.
     */
    public function index(): JsonResponse
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ], 200);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        try {
            if ($notification->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            $notification->update(['status' => 'read']);

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read',
                'data' => $notification,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): JsonResponse
    {
        try {
            auth()->user()
                ->notifications()
                ->where('status', 'unread')
                ->update(['status' => 'read']);

            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notifications as read',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Delete a notification.
     */
    public function destroy(Notification $notification): JsonResponse
    {
        try {
            if ($notification->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            $notification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notification deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete notification',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
