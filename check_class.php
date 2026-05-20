<?php
require __DIR__.'/backend/vendor/autoload.php';
$exists = class_exists('App\Http\Controllers\SavedArticleController');
file_put_contents('tmp_check.txt', $exists ? 'YES' : 'NO');
?>
