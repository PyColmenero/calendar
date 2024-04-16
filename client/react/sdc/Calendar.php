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



// Function to create a new calendar entry
function createCalendarEntry()
{
    global $conn;
    // $name = $conn->real_escape_string($name);
    // $description = $conn->real_escape_string($description);
    $input = file_get_contents('php://input');
    $data = json_decode($input, true); // Set second parameter to true to get an associative array

    if ($data === null) {
        // Invalid JSON format
        http_response_code(400);
        echo json_encode(array('error' => 'Invalid JSON data'));
        exit();
    }

    // Now you can access the data like this
    $name = $data['name'];
    $description = $data['description'];



    $sql = "INSERT INTO calendar (name, description, creation_date) VALUES ('$name', '$description', NOW())";
    $result = $conn->query($sql);

    if ($result === false) {
        return 'Error creating calendar entry: ' . $conn->error;
    }
    return false;
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
function updateCalendarEntry($id, $name, $description)
{
    global $conn;
    $id = intval($id);
    $name = $conn->real_escape_string($name);
    $description = $conn->real_escape_string($description);

    $sql = "UPDATE calendar SET name = '$name', description = '$description' WHERE id = $id";
    $result = $conn->query($sql);

    return $result;
}

// Function to delete a calendar entry
function deleteCalendarEntry()
{
    global $conn;

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if ($data === null) {
        // Invalid JSON format
        http_response_code(400);
        echo json_encode(array('error' => 'Invalid JSON data'));
        exit();
    }

    // Now you can access the data like this
    $id = $data['id'];

    $sql = "DELETE FROM calendar WHERE id = $id";
    $result = $conn->query($sql);

    if ($result === false) {
        return 'Error creating calendar entry: ' . $conn->error;
    }
    return false;

}

// echo "ola1";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $error = createCalendarEntry();

    if (!$name) {
        echo "Name is neccesary.";
        return;
    }

    if ($error) {
        echo $error;
    } else {
        echo "OK";
    }
}
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);

    $result = deleteCalendarEntry();

    if ($error) {
        echo $error;
    } else {
        echo "OK: " . $id;
    }
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $entries = getCalendarEntries();

    $calendarList = array();
    foreach ($entries as $entry) {
        $calendarList[] = array(
            'id' => $entry['id'],
            'name' => $entry['name'],
            'description' => $entry['description'],
            'creation_date' => $entry['creation_date']
        );
    }

    header('Content-Type: application/json');
    echo json_encode($calendarList);

}




// // Close the database connection
// $conn->close();
// ?>