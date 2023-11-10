<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization");


require_once '/opt/lampp/htdocs/AngularJS_Unit2_6/API/models/Model.php';

class Controller
{
    private $studentModel;

    public function __construct()
    {
        $this->studentModel = new Model();
    }

    public function insertDetails($studentData)
    {

        $result = $this->studentModel->insertDetailsINDB($studentData);

        if ($result) {

            $response = array(
                "status" => "success",
                "message" => "Student data inserted successfully."
            );
            header("Content-Type: application/json");
            http_response_code(200); // OK
            echo json_encode($response);
        } else {

            $response = array(
                "status" => "error",
                "message" => "Failed to insert student data."
            );
            header("Content-Type: application/json");
            http_response_code(400); // Bad Request
            echo json_encode($response);
        }
    }

    public function getStudentById($studentId)
    {

        $studentData = $this->studentModel->getStudentByIdINDB($studentId);

        if (empty($studentData)) {
            $response = array(
                "status" => "error",
                "message" => "Failed to fetch student data."
            );
            header("Content-Type: application/json");
            http_response_code(400);
            echo json_encode($response);
        } else {
            $response = array(
                "status" => "success",
                "message" => "student data fetched successfully"
            );
            header("Content-Type: application/json");
            http_response_code(200);
            echo json_encode($studentData);
        }
    }

    public function getAllStudentsByAdminId($adminId){
        $studentsList = $this->studentModel->getAllStudentsByAdminIdFromDB($adminId);
        if (empty($studentsList)) {
            $response = array(
                "status" => "error",
                "message" => "Failed to fetch student data."
            );
            header("Content-Type: application/json");
            http_response_code(400);
            echo json_encode($response);
        } else {
            $response = array(
                "status" => "success",
                "message" => "student data fetched successfully"
            );
            header("Content-Type: application/json");
            http_response_code(200);
            echo json_encode($studentsList);
        }

    }

    public function updateDetails($studentId, $updatedData)
    {
        $result = $this->studentModel->updateDetailsINDB($studentId, $updatedData);
        if (!$result) {
            $response = array(
                "status" => "error",
                "message" => "Failed to update student data."
            );
            header("Content-Type: application/json");
            http_response_code(400);
            echo json_encode($response);
        } else {
            $response = array(
                "status" => "success",
                "message" => "student data updated successfully"
            );
            header("Content-Type: application/json");
            http_response_code(200);
            echo json_encode($response);
        }
    }

    public function deleteDetails($studentId,$studentName)
    {

        $result = $this->studentModel->deleteDetailsINDB($studentId,$studentName);

        if ($result) {

            $response = array(
                "status" => "success",
                "message" => "Student data removed successfully."
            );
            header("Content-Type: application/json");
            http_response_code(200); // OK
            echo json_encode($response);
        } else {

            $response = array(
                "status" => "error",
                "message" => "Failed to delete student data."
            );
            header("Content-Type: application/json");
            http_response_code(400); // Bad Request
            echo json_encode($response);
        }
    }
}


$controller = new Controller();


//If the server request is POST and action is set to addStudent then the block calls respective controller method to add student data.
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_REQUEST['action']) && $_REQUEST['action'] === 'addStudent') {
    $json_data = file_get_contents('php://input');
    $studentData = json_decode($json_data, true);

   

    $controller->insertDetails($studentData);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Check if the student ID is provided in the request (either in the URL or request body)
    $studentId = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;

    $studentName= isset($_REQUEST['name'])? $_REQUEST['name']: null;

    if ($studentId == null || !is_numeric($studentId)) {
        $response = array(
            "status" => "Failed",
            "message" => "Invalid Student Id."
        );
        header("Content-Type: application/json");
        http_response_code(400);
        echo json_encode($response);
    } else {
        $controller->deleteDetails($studentId,$studentName);
    }
} if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check the request URL to determine the endpoint
    $requestUri = $_SERVER['REQUEST_URI'];

    if (strpos($requestUri, '/getStudentById') !== false) {
        // Endpoint 1: Get Student by ID
        $studentId = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;
        
        if ($studentId == null || !is_numeric($studentId)) {
            $response = array(
                "status" => "Failed",
                "message" => "Invalid Student Id."
            );
            header("Content-Type: application/json");
            http_response_code(400);
            echo json_encode($response);
        } else {
            $controller->getStudentById($studentId);
        }
    } elseif (strpos($requestUri, '/getAllStudentsByAdminId') !== false) {
        // Endpoint 2: Get All Students

        $adminId = isset($_REQUEST['adminId']) ? $_REQUEST['adminId'] : null;
        if (empty($adminId)) {
            $response = array(
                "status" => "Failed",
                "message" => "Invalid Admin Id."
            );
            header("Content-Type: application/json");
            http_response_code(400);
            echo json_encode($response);
        } else {
            $controller->getAllStudentsByAdminId($adminId);
        }
        
    } else {
        // Handle unknown endpoints or provide a default response
        $response = array(
            "status" => "Failed",
            "message" => "Unknown endpoint."
        );
        header("Content-Type: application/json");
        http_response_code(404);
        echo json_encode($response);
    }
}
 elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {


    $json_data = file_get_contents('php://input');
    $updatedData = json_decode($json_data, true);
    // Check if the student ID is provided in the request (either in the URL or request body)
    $studentId = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;
    if ($studentId == null || !is_numeric($studentId)) {
        $response = array(
            "status" => "Failed",
            "message" => "Invalid Student Id."
        );
        header("Content-Type: application/json");
        http_response_code(400);
        echo json_encode($response);
    } else {
        $controller->updateDetails($studentId, $updatedData);
    }
} 



// else {
//     header("Content-Type: application/json");
//     http_response_code(404);
//     echo json_encode(array("status" => "Failed", "message" => "Invalid request data"));
// }
