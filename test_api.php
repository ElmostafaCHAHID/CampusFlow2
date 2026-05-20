<?php
$context = stream_context_create(['http' => ['ignore_errors' => true]]);
$result = file_get_contents('http://127.0.0.1:8000/api/categories', false, $context);
file_put_contents('api_error.txt', $result);
