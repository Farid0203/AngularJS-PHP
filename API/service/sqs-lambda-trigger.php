<?php

require 'aws-sdk/vendor/autoload.php'; // Include the AWS SDK for PHP

use Aws\Sqs\SqsClient;

class SQSProcessor
{
    private $sqs;

    public function __construct($region, $accessKeyId, $secretAccessKey)
    {
        $this->sqs = new SqsClient([
            'region' => $region,
            'version' => 'latest',
            'credentials' => [
                'key' => $accessKeyId,
                'secret' => $secretAccessKey,
            ],
        ]);
    }

    public function sendMessage($queueUrl, $messageBody)
    {
        $result = $this->sqs->sendMessage([
            'QueueUrl' => $queueUrl,
            'MessageBody' => $messageBody,
        ]);

        // Check for errors in $result
        if (!$result) {
            die('Error sending message to SQS queue.');
        }
    }

    public function waitForProcessing($seconds)
    {
        sleep($seconds);
    }

    // Add methods for result retrieval and processing as needed

    public function notifyUserDeletion($queueUrl, $userName)
    {
        // Send a message to SQS queue to notify the user about the deletion
        $this->sendMessage($queueUrl, "User $userName: Your registration or account has been successfully deleted.");
    }
}

// AWS credentials and configuration
$region = 'your-region';
$accessKeyId = 'your-access-key-id';
$secretAccessKey = 'your-secret-access-key';
$queueUrl = 'your-sqs-queue-url';

// Create SQSProcessor instance
$sqsProcessor = new SQSProcessor($region, $accessKeyId, $secretAccessKey);

// Example: Delete user registration or account
$userName = 'JohnDoe'; 

// Notify the user about the deletion
$sqsProcessor->notifyUserDeletion($queueUrl, $userName);

// Wait for Lambda function to process the message (adjust the sleep time as needed)
$sqsProcessor->waitForProcessing(10);













































// Now, you might retrieve and process the result using your preferred method.
// This could involve another SQS queue, database, or any other storage solution.

// Example: Retrieving result from a hypothetical result database table
// $result = $sqsProcessor->retrieveResultFromDatabase($messageId);

// Example: Processing the result
// $sqsProcessor->processResult($result);

// Add methods to the SQSProcessor class for result retrieval and processing as needed
// class SQSProcessor {
//    ...
//    public function retrieveResultFromDatabase($messageId) {
//        // Your database retrieval logic here
//    }
//
//    public function processResult($result) {
//        // Your result processing logic here
//        echo 'Result: ' . $result . PHP_EOL;
//    }
// }
