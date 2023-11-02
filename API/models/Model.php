<?php

require_once '/opt/lampp/htdocs/AngularJS_Unit2_6/API/config/Config.php';

require_once '/opt/lampp/htdocs/AngularJS_Unit2_6/API/service/EmailService.php';

require_once '/opt/lampp/htdocs/AngularJS_Unit2_6/API/logger/Logger.php';


class Model
{
    private $conn;


    public function __construct()
    {
        $db = new Config();
        $this->conn = $db->dbConnect();
    }




    public function insertDetailsINDB($studentData)
    {



        Logger::logApi("inside insert detail");

        try {

            $studentId = null;


            // Prepare the SQL statement with placeholders for the parameters
            $query = "INSERT INTO students (firstName, lastName, gender, dateOfBirth, email, phoneNumber,permanentAddress, currentAddress, motherName, fatherName, degree, department, degreeType, partTimeTiming, adminId, motherTongue, nationality) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

            $stmt = $this->conn->prepare($query);

            if (!$stmt) {

                Logger::logApi("Error preparing student data insert query");
                return false;
            }



            // Bind the parameters to the statement
            $stmt->bind_param(
                "sssssssssssssssss",
                $studentData['firstName'],
                $studentData['lastName'],
                $studentData['gender'],
                $studentData['dateOfBirth'],
                $studentData['email'],
                $studentData['phoneNumber'],
                $studentData['permanentAddress'],
                $studentData['currentAddress'],
                $studentData['motherName'],
                $studentData['fatherName'],
                $studentData['degree'],
                $studentData['department'],
                $studentData['degreeType'],
                $studentData['partTimeTiming'],
                $studentData['adminId'],
                $studentData['motherTongue'],
                $studentData['nationality']
            );

            $studentInsertResult = $stmt->execute();

            if ($studentInsertResult) {


                $recipient = $studentData['email']; // Assuming 'email' is the key for the email address in $studentData

                $emailService = new EmailService();


                if ($emailService->sendEmail($recipient)) {
                    Logger::logApi("Email sent successfully");
                } else {
                    Logger::logApi("Failed to send email");
                }
                $studentId = $this->conn->insert_id;
                Logger::logApi("Student ID: $studentId inserted successfully");
            } else {
                Logger::logApi("Error inserting student data");
                $stmt->close();
                return false;
            }

            if (array_key_exists('qualifications', $studentData) && !empty($studentId)) {
                foreach ($studentData['qualifications'] as $qualification) {
                    $qualificationsInsertQuery = "INSERT INTO qualifications (student_id, qualification, year, institutionType, institutionName) 
                    VALUES (?, ?, ?, ?, ?)";

                    $stmt = $this->conn->prepare($qualificationsInsertQuery);

                    if (!$stmt) {
                        Logger::logApi("Error preparing qualification insert query for student ID $studentId");
                        return false;
                    }

                    $stmt->bind_param("issss", $studentId, $qualification["qualification"], $qualification["year"], $qualification["institutionType"], $qualification["institutionName"]);
                    $qualificationsInsertResult = $stmt->execute();

                    if ($qualificationsInsertResult) {
                        Logger::logApi("Qualification inserted successfully for student ID $studentId");
                    } else {
                        Logger::logApi("Error inserting qualification for student ID $studentId");
                        $stmt->close();
                        return false;
                    }
                }
            } else {

                Logger::logApi("No qualifications to insert for student ID $studentId");
                $stmt->close();
            }

            $stmt->close();
            return true;
        } catch (Exception $e) {
            Logger::logApi("DB error: " . $e->getMessage());
        }
    }






    public function updateDetailsINDB($studentId, $updatedData)
    {

        try {
            // First, retrieve the existing student data
            $selectQuery = "SELECT * FROM students WHERE id = ?";
            $stmt = $this->conn->prepare($selectQuery);


            if ($stmt) {
                $stmt->bind_param("i", $studentId);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows === 0) {
                    return false;
                }


                $existingStudentData = $result->fetch_assoc();
                $updateFields = [];
                foreach ($updatedData as $key => $value) {
                    if (array_key_exists($key, $existingStudentData) && $existingStudentData[$key] !== $value) {
                        $updateFields[$key] = $value;
                    }
                }


                if (!empty($updateFields)) {
                    $updateQuery = "UPDATE students SET ";
                    $updateValues = [];

                    foreach ($updateFields as $key => $value) {
                        $updateQuery .= "$key = ?, ";
                        $updateValues[] = $value;
                    }

                    $updateQuery = rtrim($updateQuery, ", ");
                    $updateQuery .= " WHERE id = ?";
                    $updateValues[] = $studentId;
                    Logger::logApi($updateQuery);

                    $updateStmt = $this->conn->prepare($updateQuery);

                    if ($updateStmt) {
                        $updateStmt->bind_param(str_repeat("s", count($updateValues)), ...$updateValues);
                        $updateStmt->execute();


                        if (isset($updatedData['qualifications']) &&  json_encode($updatedData['qualifications']) !== json_encode($this->getStudentQualifications($studentId))) {
                            $this->updateQualifications($studentId, $updatedData['qualifications']);
                        }

                        return true;
                    }
                } else {
                    if (isset($updatedData['qualifications']) && json_encode($updatedData['qualifications']) !== json_encode($this->getStudentQualifications($studentId))) {
                        $this->updateQualifications($studentId, $updatedData['qualifications']);
                    }
                    return true;
                }
            }
        } catch (Exception $e) {
            $this->conn->close();
            Logger::logApi("DB error: " . $e->getMessage());
            return false;
        }
    }


    private function getStudentQualifications($studentId)
    {
        $selectQuery = "SELECT qualification, year, institutionType, institutionName FROM qualifications WHERE student_id = ?";
        $stmt = $this->conn->prepare($selectQuery);

        if ($stmt) {
            $stmt->bind_param("i", $studentId);
            $stmt->execute();
            $result = $stmt->get_result();
            $qualifications = [];

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $qualifications[] = $row;
                }
            }
            return $qualifications;
        } else {
            return [];
        }
    }

    // Update qualifications
    private function updateQualifications($studentId, $updatedQualifications)
    {
        try {
            // Delete existing qualifications
            $deleteQuery = "DELETE FROM qualifications WHERE student_id = ?";
            $deleteStmt = $this->conn->prepare($deleteQuery);
            $deleteStmt->bind_param("i", $studentId);
            $deleteStmt->execute();

            // Insert updated qualifications if any
            if (!empty($updatedQualifications)) {
                $insertQuery = "INSERT INTO qualifications (student_id, qualification, year, institutionType, institutionName) VALUES (?, ?, ?, ?, ?)";
                $insertStmt = $this->conn->prepare($insertQuery);

                foreach ($updatedQualifications as $qualification) {
                    $insertStmt->bind_param("issss", $studentId, $qualification['qualification'], $qualification['year'], $qualification['institutionType'], $qualification['institutionName']);
                    $insertStmt->execute();
                }
            }
        } catch (Exception $e) {
            $this->conn->close();
            Logger::logApi("DB error: " . $e->getMessage());
            return false;
        }
    }
    private function getStudentsByAdminIdFromDB($adminId)
    {
        try {
            $query = "SELECT * FROM students WHERE adminId = ?";
            $stmt = $this->conn->prepare($query);

            if ($stmt) {
                $stmt->bind_param("i", $adminId);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    $students = array();

                    while ($row = $result->fetch_assoc()) {
                        $students[$row['id']] = $row;
                    }

                    return $students;
                }
            }
        } catch (Exception $e) {
            Logger::logApi("DB error: " . $e->getMessage());
        }

        return null;
    }



    private function getQualificationDataFromDB()
    {
        try {
            $query = "SELECT student_id, qualification, year, institutionType, institutionName FROM qualifications";
            $stmt = $this->conn->prepare($query);

            if ($stmt) {
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    $qualifications = array();

                    while ($row = $result->fetch_assoc()) {
                        $studentId = $row['student_id'];

                        if (!isset($qualifications[$studentId])) {
                            $qualifications[$studentId] = array();
                        }

                        $qualification = array(
                            'qualification' => $row['qualification'],
                            'year' => $row['year'],
                            'institutionType' => $row['institutionType'],
                            'institutionName' => $row['institutionName'],
                        );

                        $qualifications[$studentId][] = $qualification;
                    }

                    return $qualifications;
                }
            }
        } catch (Exception $e) {
            Logger::logApi("DB error: " . $e->getMessage());
        }

        return null;
    }

    public function getAllStudentsByAdminIdFromDB($adminId)
    {
        $studentData = $this->getStudentsByAdminIdFromDB($adminId);
        $qualificationData = $this->getQualificationDataFromDB();

        if ($studentData !== null && $qualificationData !== null) {
            foreach ($studentData as $studentId => &$student) {
                $student['qualifications'] = isset($qualificationData[$studentId]) ? $qualificationData[$studentId] : array();
            }

            return array_values($studentData);
        }

        return null;
    }



    public function getStudentByIdINDB($studentId)
    {

        try {
            $query = "SELECT s.*, q.qualification, q.year, q.institutionType, q.institutionName FROM students s
                LEFT JOIN qualifications q ON s.id = q.student_id
                WHERE s.id = ?";
            $stmt = $this->conn->prepare($query);


            if ($stmt) {
                $stmt->bind_param("i", $studentId);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    $studentData = null;

                    $qualifications = array();

                    while ($row = $result->fetch_assoc()) {
                        if ($studentData === null) {
                            $studentData = $row;
                            unset($studentData['qualification'], $studentData['year'], $studentData['institutionType'], $studentData['institutionName']);
                        }

                        // Collect qualifications
                        $qualification = array(
                            'qualification' => $row['qualification'],
                            'year' => $row['year'],
                            'institutionType' => $row['institutionType'],
                            'institutionName' => $row['institutionName'],
                        );
                        $qualifications[] = $qualification;
                    }

                    // Add the qualifications array to the student data
                    $studentData['qualifications'] = $qualifications;
                    Logger::logApi("Student with ID: $studentId fetched successfully");
                    $stmt->close();
                    return $studentData;
                } else {
                    Logger::logApi("No record found with ID: $studentId");
                    $stmt->close();
                    return null;
                }
            } else {
                Logger::logApi("Error preparing select query for student ID $studentId");
                return null;
            }
        } catch (Exception $e) {
            Logger::logApi("DB error: " . $e->getMessage());
            return null;
        }
    }
    public function deleteDetailsINDB($studentId)
    {
        try {
            $query = "DELETE FROM students WHERE id = ?";
            $stmt = $this->conn->prepare($query);

            if ($stmt) {
                $stmt->bind_param("i", $studentId);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    Logger::logApi("Student with ID: $studentId removed successfully");
                    $stmt->close();
                    $this->conn->close();
                    return true;
                } else {
                    Logger::logApi("No record found with ID: $studentId");
                    $stmt->close();
                    $this->conn->close();
                    return false;
                }
            } else {
                Logger::logApi("Error preparing delete query for student ID $studentId");
                $this->conn->close();
                return false;
            }
        } catch (Exception $e) {
            Logger::logApi("DB error: " . $e->getMessage());
            $this->conn->close();
            return false;
        }
    }
}//gduq jwwd muwr vdhf
