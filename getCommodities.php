<?php
$servername = "192.168.1.29:3221";
$username = "root";
$password = "root";
$dbname = "Assesment2";

try {
   $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
   $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

   $stmt = $conn->query("SELECT * FROM commodities");
   $commodities = $stmt->fetchAll(PDO::FETCH_ASSOC);

   echo json_encode($commodities);
} catch (PDOException $e) {
   echo "Connection failed: " . $e->getMessage();
}
