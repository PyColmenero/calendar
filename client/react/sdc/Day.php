<?php

// Allow from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Allow credentials if needed (only if your client sends credentials like cookies)
// header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No content
    exit();
}




// Replace these variables with your actual database connection details
// $servername = "212.107.17.103";
// $username = "u160084056_boomerpedia";
// $password = "acolmenero.comCONTRA2002.";
// $database = "u160084056_boomerpedia";
// // Replace these variables with your actual database connection details
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



// Function to create a new calendar entry
function checkOrCreateDay()
{
    global $conn;
    
    $linked_date = $_GET['date'];
    $fk_id_calendar = $_GET['calendar_id'];
    $sql = "SELECT * FROM days WHERE linked_date = '$linked_date' AND fk_id_calendar = $fk_id_calendar";
    $result = $conn->query($sql);


    if ($result === false) {
        return 'Error creating calendar entry: ' . $conn->error;
    }

    if ($result->num_rows == 0) {
        $insertSql = "INSERT INTO days (content, creation_date, linked_date, fk_id_calendar) VALUES ('', NOW(), '$linked_date', $fk_id_calendar)";
        if ($conn->query($insertSql) === TRUE) {
            $content = '';
        } else {
            return "Error creating day: " . $conn->error;
        }
    } else {
        $row = $result->fetch_assoc();
        $content = $row['content'];
    }

    return $content;
}

// Function to retrieve all calendar entries
function getCalendarEntries()
{
    global $conn;

    $sql = "SELECT * FROM calendar";
    $result = $conn->query($sql);

    $entries = array();
    while ($row = $result->fetch_assoc()) {
        $entries[] = $row;
    }

    return $entries;
}

// Function to update a calendar entry
function updateDayContent()
{
    global $conn;

    $input = file_get_contents('php://input');
    $body = json_decode($input, true);

    if ($body === null) {
        // Invalid JSON format
        http_response_code(400);
        return "error";
    }
    
    $fk_id_calendar = $body['calendar_id'];
    $content = $body['content'];
    $linked_date = $body['date'];
    

    $sql = "UPDATE days SET content = '$content' WHERE linked_date = '$linked_date' AND fk_id_calendar = $fk_id_calendar";
    $result = $conn->query($sql);

    if ($result === false) {
        return "Error creating calendar entry ($sql): " . $conn->error;
    }

    return 'OK';
}




if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $error = updateDayContent();

    echo $error;

}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    $content = checkOrCreateDay();

    echo $content;

}




// // Close the database connection
// $conn->close();
// ?>