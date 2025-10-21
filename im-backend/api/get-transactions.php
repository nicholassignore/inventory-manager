<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

$transactionsFile = __DIR__ . "/../data/transactions.json";
$transactions = [];

if (file_exists($transactionsFile)) {
    $transactionsJson = file_get_contents($transactionsFile);
    $transactionsArray = json_decode($transactionsJson, true);

    foreach ($transactionsArray as $transaction) {
        $transactions[] = [
            'id' => $transaction['id'] ?? 0,
            'name' => $transaction['name'] ?? '',
            'values' => $transaction['values'] ?? []
        ];
    }
}

echo json_encode([
"transactions" => $transactions
]);


