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


$servername = "212.107.17.103";
$username = "u160084056_calendarios";
$password = "acolmenero.comCONTRA2002.";
$database = "u160084056_calendarios";
$conn = new mysqli($servername, $username, $password, $database);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $fk_id_calendar = $_GET['calendar_id'];

    $sql = "SELECT linked_date, content, creation_date FROM days WHERE fk_id_calendar = $fk_id_calendar ORDER BY creation_date DESC"; // GROUP BY linked_date";
    $result = $conn->query($sql);

    $calendarList = array();
    while ($row = $result->fetch_assoc()) {
        if(!$row['content']) {
            continue;
        }
        $calendarList[] = array(
            'content' => $row['content'],
            'linked_date' => $row['linked_date']
        );
    }

    header('Content-Type: application/json');
    echo json_encode($calendarList);

}