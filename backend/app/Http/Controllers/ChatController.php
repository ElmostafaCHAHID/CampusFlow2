<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Helpers\BroadcastHelper;

class ChatController extends Controller
{
    // Return list of conversations (partners and last message)
    public function conversations(Request $request): JsonResponse
    {
        $user = $request->user();

        // Fetch recent messages involving the user
        $messages = Message::where(function ($q) use ($user) {
            $q->where('sender_id', $user->id)
              ->orWhere('recipient_id', $user->id);
        })->orderBy('created_at', 'desc')->get();

        // Group by partner id to get last message per conversation
        $conversations = collect([]);
        foreach ($messages as $msg) {
            $partnerId = $msg->sender_id === $user->id ? $msg->recipient_id : $msg->sender_id;
            if (!$conversations->has($partnerId)) {
                $partner = User::find($partnerId);
                $unread = Message::where('sender_id', $partnerId)
                    ->where('recipient_id', $user->id)
                    ->whereNull('read_at')
                    ->count();

                $conversations->put($partnerId, [
                    'user' => $partner,
                    'last_message' => $msg,
                    'unread_count' => $unread,
                ]);
            }
        }

        return response()->json(['success' => true, 'data' => $conversations->values()]);
    }

    // Get messages between auth user and given user
    public function messagesWith(Request $request, User $user): JsonResponse
    {
        $me = $request->user();

        // Permission: must follow or be followed
        $allowed = $me->following()->where('users.id', $user->id)->exists() ||
                   $me->followers()->where('users.id', $user->id)->exists();

        if (!$allowed) {
            return response()->json(['success' => false, 'message' => 'You can only message users you follow or who follow you'], 403);
        }

        $messages = Message::where(function ($q) use ($me, $user) {
            $q->where('sender_id', $me->id)->where('recipient_id', $user->id);
        })->orWhere(function ($q) use ($me, $user) {
            $q->where('sender_id', $user->id)->where('recipient_id', $me->id);
        })->orderBy('created_at', 'asc')->with(['sender', 'recipient'])->get();

        // Mark messages received by me as read
        Message::where('sender_id', $user->id)
            ->where('recipient_id', $me->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['success' => true, 'data' => $messages]);
    }

    // Send a message to a user (requires follow relationship)
    public function sendMessage(Request $request): JsonResponse
    {
        $me = $request->user();

        $data = $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'body' => 'required|string|max:2000',
        ]);

        $recipient = User::find($data['recipient_id']);

        // Permission check: allow if either follows the other
        $allowed = $me->following()->where('users.id', $recipient->id)->exists() ||
                   $me->followers()->where('users.id', $recipient->id)->exists();

        if (!$allowed) {
            return response()->json(['success' => false, 'message' => 'You can only message users you follow or who follow you'], 403);
        }

        $message = Message::create([
            'sender_id' => $me->id,
            'recipient_id' => $recipient->id,
            'body' => $data['body'],
        ]);

        $message->load('sender');

        $notificationMsg = "New message from {$me->name}";
        $notification = \App\Models\Notification::create([
            'user_id' => $recipient->id,
            'message' => $notificationMsg,
        ]);

        // Broadcast to WebSocket server for real-time delivery
        BroadcastHelper::broadcast([
            'type' => 'message',
            'recipient_id' => $recipient->id,
            'sender_id' => $me->id,
            'message' => $message,
            'notification' => $notification,
        ]);

        return response()->json(['success' => true, 'data' => $message], 201);
    }
}
