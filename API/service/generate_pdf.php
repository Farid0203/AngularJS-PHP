<?php
    require 'dompdf/vendor/autoload.php'; 

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Check if student HTML content is provided in the POST request
        $htmlTemplate = file_get_contents('php://input');

        // Initialize DOMPDF
        $dompdf = new Dompdf\Dompdf();

        // Load HTML content
        $dompdf->loadHtml($htmlTemplate);

        // Set paper size and orientation (e.g., A4 portrait)
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the PDF to the browser or save it to a file
        $pdfFileName = 'student_registration_details.pdf';
        $dompdf->stream($pdfFileName);

        // Return the file name to the client
        echo $pdfFileName;
    }
