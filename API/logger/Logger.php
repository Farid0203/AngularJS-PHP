<?php
class Logger {
    public static function logApi($message) {
        // Define the log file path
        $logFilePath = __DIR__ . '/api_logs.txt';

        // Get the current date and time
        $timestamp = date('Y-m-d H:i:s');

        // Construct the log message
        $logMessage = "[$timestamp] $message" . PHP_EOL;

        // Append the log message to the log file
        file_put_contents($logFilePath, $logMessage, FILE_APPEND);
    }
}

?>

