<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

$itemsFile = __DIR__ . "/../data/items.json";
$items = [];

if (file_exists($itemsFile)){
    $itemsJson = file_get_contents($itemsFile);
    $items = json_decode($itemsJson, true);
}

echo json_encode([
    "items" => $items
]);

