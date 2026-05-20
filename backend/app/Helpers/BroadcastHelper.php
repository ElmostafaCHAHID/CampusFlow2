<?php

namespace App\Helpers;

class BroadcastHelper
{
    /**
     * Broadcast a message to the WebSocket server.
     *
     * @param array $payload
     * @return bool
     */
    public static function broadcast(array $payload)
    {
        try {
            $json = json_encode($payload);
            $opts = [
                'http' => [
                    'method' => 'POST',
                    'header' => "Content-Type: application/json\r\n",
                    'content' => $json,
                    'timeout' => 2,
                ]
            ];

            $context = stream_context_create($opts);
            $result = @file_get_contents('http://127.0.0.1:6001/broadcast', false, $context);
            
            return $result !== false;
        } catch (\Exception $e) {
            \Log::error("Broadcast failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Broadcast a notification to a specific user.
     *
     * @param int $recipientId
     * @param string $message
     * @param mixed $data
     * @return bool
     */
    public static function broadcastNotification($recipientId, $message, $notificationObj = null)
    {
        return self::broadcast([
            'type' => 'notification',
            'recipient_id' => $recipientId,
            'message' => $message,
            'notification' => $notificationObj,
        ]);
    }
}
