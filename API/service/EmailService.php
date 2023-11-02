<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require     'phpmailer/src/Exception.php';
require      'phpmailer/src/PHPMailer.php';
require     'phpmailer/src/SMTP.php';
include '/opt/lampp/htdocs/AngularJS_Unit2_6/API/logger/Logger.php';




class EmailService
{
    private $mailer;

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);
    }

    public function sendEmail($recipient)
    {



        try {
            //Server settings
            $this->mailer->isSMTP();
            $this->mailer->Host       = 'smtp.gmail.com'; // SMTP server
            $this->mailer->SMTPAuth   = true;
            $this->mailer->Username   = 'muhammed.farid@nilaapps.co.in'; // Your email
            $this->mailer->Password   = 'rqgjgkhuehubnvsh'; // Your email password
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption
            $this->mailer->Port       = 587;

            //Recipients
            $this->mailer->setFrom('muhammed.farid@nilaapps.co.in', 'Muhammed Farid');
            $this->mailer->addAddress($recipient);

            // Content
            $this->mailer->isHTML(true);
            $this->mailer->Subject = "Registration Successfull";

            // Check if the recipient's email ends with 'gmail.com' and select the appropriate template
            if (strpos($recipient, 'gmail.com') !== false) {
                // Load the Gmail template
                $htmlContent = file_get_contents('/opt/lampp/htdocs/AngularJS_Unit2_6/app/view/gmailTemplate.html');
            } elseif (strpos($recipient, 'yahoo.com') !== false) {
                // Load the Yahoo template
                $htmlContent = file_get_contents('/opt/lampp/htdocs/AngularJS_Unit2_6/app/view/yahooTemplate.html');
            } else {
                // Use a default template if no specific match is found
                $htmlContent = file_get_contents('/opt/lampp/htdocs/AngularJS_Unit2_6/app/view/defaultEmailTemplate.html');
            }
            
            $this->mailer->Body    = $htmlContent;
            if ($this->mailer->send()) {
                return true;
            } else {
                Logger::logApi("Email could not be sent. Error: " . $this->mailer->ErrorInfo);
                return false;
            }
            return true;
        } catch (Exception $e) {
            Logger::logApi("Email sending failed with an exception: " . $e->getMessage());
            return false;
        }
    }
}
