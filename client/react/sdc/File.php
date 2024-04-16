<?php

// Allow from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No content
    exit();
}


// Replace these variables with your actual database connection details
$servername = "212.107.17.103";
$username = "u160084056_calendarios";
$password = "acolmenero.comCONTRA2002.";
$database = "u160084056_calendarios";

// Create a database connection
$conn = new mysqli($servername, $username, $password, $database);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadedFile = $_FILES['file'];
    $uploadedThumbnail = $_FILES['thumbnail'];
    $fk_id_calendar = $_POST['calendar_id'];
    $date = $_POST['date'];

    if ($uploadedFile['error'] === UPLOAD_ERR_OK) {
        $uploadThumbnailDir = '../uploads/thumbnails/'; // Directory where you want to save the files
        $uploadDir = '../uploads/'; // Directory where you want to save the files
        $uploadDDBBDir = 'uploads/'; // Directory where you want to save the files
        $randomName = uniqid() . '_' . $uploadedFile['name'] . '.webp'; // Generate a unique name

        $destination = $uploadDir . $randomName;
        $destinationThumbnail = $uploadThumbnailDir . $randomName;
        $destinationDDBB = $uploadDDBBDir . $randomName;

        if (move_uploaded_file($uploadedFile['tmp_name'], $destination) && move_uploaded_file($uploadedThumbnail['tmp_name'], $destinationThumbnail)) {


            $sql = "INSERT INTO files (filename, creation_date, linked_date, fk_id_calendar) VALUES ('$destinationDDBB', NOW(), '$date', $fk_id_calendar)";
            $result = $conn->query($sql);

            if ($result === false) {
                echo 'Error creating calendar entry: ' . $conn->error;
            }
            // return false;

            echo "File successfully uploaded and saved to $fk_id_calendar : $destination.";

        } else {
            echo 'Error saving the file.';
        }
    } else {
        echo 'File upload error: ' . $uploadedFile['error'];
    }
}
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $input = file_get_contents('php://input');
    $body = json_decode($input, true);

    if ($body === null) {
        // Invalid JSON format
        http_response_code(400);
        return "error";
    }

    $file_id = $body['file_id'];

    $sql = "DELETE FROM files WHERE id = $file_id";
    $result = $conn->query($sql);

    if ($result === false) {
        echo 'Error creating calendar entry: ' . $conn->error;
    }

    echo "OK";

}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $fk_id_calendar = $_GET['calendar_id'];
    $date = $_GET['date'];


    $sql = "SELECT * FROM files WHERE linked_date = '$date' AND fk_id_calendar = $fk_id_calendar ";
    $result = $conn->query($sql);

    $calendarList = array();
    while ($row = $result->fetch_assoc()) {
        $calendarList[] = array(
            'id' => $row['id'],
            'filename' => $row['filename'],
            'linked_date' => $row['linked_date'],
            'fk_id_calendar' => $row['fk_id_calendar'],
            'creation_date' => $row['creation_date']
        );
    }

    header('Content-Type: application/json');
    echo json_encode($calendarList);


}