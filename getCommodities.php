<?php
$servername = "localhost";
$username = "your_db_username";
$password = "your_db_password";
$dbname = "your_db_name";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM commodities";
$result = $conn->query($sql);

$commodities = array();
while($row = $result->fetch_assoc()) {
    $commodities[] = $row;
}

echo json_encode($commodities);
$conn->close();
?>
