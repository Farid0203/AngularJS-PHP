<?php
require 'vendor/autoload.php';

use Aws\Sdk;

$aws = new Sdk([
    'region' => 'your_region',     // Replace with your AWS region, e.g., 'us-east-1'
    'version' => 'latest',         // Specify the API version you want to use
]);

// Create an SQS client
$sqs = $aws->createSqs();

// Define the SQS queue URL
$queueUrl = 'your_queue_url';     // Replace with your SQS queue URL

// Send a message to the SQS queue
$message = 'Hello, this is an SQS message.';
$result = $sqs->sendMessage([
    'QueueUrl'    => $queueUrl,
    'MessageBody' => $message,
]);

// Check for success
if ($result) {
    echo "Message sent to SQS queue successfully.\n";
} else {
    echo "Failed to send message to SQS queue.\n";
}

// Create an S3 client
$s3 = $aws->createS3();

// Define your S3 bucket name
$bucketName = 'your_bucket_name';   // Replace with your S3 bucket name

// Specify the file you want to upload
$filePath = 'path/to/your/file.jpg';  // Replace with the local file path

// Upload the file to S3
try {
    $s3->putObject([
        'Bucket'     => $bucketName,
        'Key'        => basename($filePath),
        'SourceFile' => $filePath,
    ]);
    echo "File uploaded to S3 bucket successfully.\n";
} catch (Exception $e) {
    echo "Failed to upload file to S3: " . $e->getMessage() . "\n";
}
?>
