<?php
define('LARAVEL_START', microtime(true));
require __DIR__.'/backend/vendor/autoload.php';
$app = require_once __DIR__.'/backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

try {
    $admin = User::where('email', 'admin@mostafa.com')->first();
    if ($admin) {
        $result = "FOUND: " . $admin->name . " | ROLE: " . $admin->role;
    } else {
        $result = "NOT FOUND";
    }
    file_put_contents('db_check.txt', $result);
} catch (Exception $e) {
    file_put_contents('db_check.txt', "ERROR: " . $e->getMessage());
}
?>
