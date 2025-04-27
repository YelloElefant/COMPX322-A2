<?php
$apiKey = "demo";
$symbol = isset($_GET['symbol']) ? $_GET['symbol'] : '';

if (!$symbol) {
   echo json_encode(["error" => "No symbol provided"]);
   exit;
}

$url = "https://www.alphavantage.co/query?function=" . urlencode($symbol) . "&interval=monthly" . "&apikey=" . urlencode($apiKey);

// Use file_get_contents OR cURL (I'll give a safe file_get_contents version)
$response = @file_get_contents($url);

if ($response === FALSE) {
   echo json_encode(["error" => "Failed to fetch data"]);
} else {
   echo $response;
}
