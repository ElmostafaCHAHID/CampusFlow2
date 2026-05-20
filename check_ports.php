<?php
function checkPort($port) {
    $host = '127.0.0.1';
    $fp = @fsockopen($host, $port, $errno, $errstr, 1);
    return !!$fp;
}

$p3306 = checkPort(3306);
$p4306 = checkPort(4306);

file_put_contents('port_check.txt', "3306: " . ($p3306 ? 'OPEN' : 'CLOSED') . "\n4306: " . ($p4306 ? 'OPEN' : 'CLOSED'));
?>
