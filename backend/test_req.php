<?php
$ch = curl_init('http://127.0.0.1:8000/api/register');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'name' => 'Test User',
    'email' => 'test3@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
echo "Response: " . curl_exec($ch);
echo "\nHTTP Code: " . curl_getinfo($ch, CURLINFO_HTTP_CODE);
