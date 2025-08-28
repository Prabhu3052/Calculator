<?php
header('Content-Type: application/json');
include 'db_config.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['estimation_number']) || empty($data['items'])) {
    echo json_encode(["status" => "error", "message" => "Required data is missing."]);
    exit();
}

try {
    $conn->begin_transaction();

    // 1. Generate a new unique marked number
    // Format: M-YYYYMMDDHHMMSS-OriginalEstimationNumber
    $originalEstNumber = $data['estimation_number'];
    $timestamp = date('YmdHis');
    $markedNumber = 'M-' . $timestamp . '-' . $originalEstNumber;

    // 2. Insert into the main 'marked_estimations' table
    $stmt_est = $conn->prepare(
        "INSERT INTO marked_estimations (marked_number, estimation_number, customer_name, phone_number, discount, total_amount, marked_at) VALUES (?, ?, ?, ?, ?, ?, NOW())"
    );
    $stmt_est->bind_param("ssssds",
        $markedNumber,
        $originalEstNumber,
        $data['customer_name'],
        $data['phone_number'],
        $data['discount'],
        $data['total_amount']
    );
    $stmt_est->execute();

    // 3. Insert each item into the 'marked_estimation_items' table
    $stmt_item = $conn->prepare(
        "INSERT INTO marked_estimation_items (marked_number, product_id, quantity, price_per_unit, total_price) VALUES (?, ?, ?, ?, ?)"
    );
    foreach ($data['items'] as $item) {
        $price_per_unit = (float)$item['price'];
        $quantity = (int)$item['quantity'];
        $total_price = $price_per_unit * $quantity;

        $stmt_item->bind_param("ssidd",
            $markedNumber,
            $item['product_id'],
            $quantity,
            $price_per_unit,
            $total_price
        );
        $stmt_item->execute();
    }
    
    // 4. Also, update the original estimation to show it's marked
    $stmt_update_est = $conn->prepare("UPDATE estimations SET is_marked = 1 WHERE estimation_number = ?");
$stmt_update_est->bind_param("s", $originalEstNumber);
$stmt_update_est->execute();


    $conn->commit();
    echo json_encode([
        "status" => "success",
        "message" => "Estimation marked successfully!",
        "marked_number" => $markedNumber
    ]);

} catch (mysqli_sql_exception $e) {
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}

$conn->close();
?>