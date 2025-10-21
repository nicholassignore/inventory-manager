<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!isset($data['transactions']) || !is_array($data['transactions'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit();
}

$file = __DIR__ . "/../data/transactions.json";
$json = json_encode($data['transactions'], JSON_PRETTY_PRINT);

if ($json === false) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to encode JSON"]);
    exit();
}

if (@file_put_contents($file, $json) !== false) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Write failed"]);
}
