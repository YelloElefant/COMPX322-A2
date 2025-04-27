<?php
$apiKey = "YOUR_ALPHAVANTAGE_API_KEY";
$symbol = $_GET['symbol'];

$url = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol={$symbol}&apikey={$apiKey}";
$response = file_get_contents($url);

echo $response;
