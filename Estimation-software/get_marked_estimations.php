<?php
header('Content-Type: application/json');
include 'db_config.php';

try {
    $markedEstimations = [];

    // 1. Fetch all marked estimations
    $stmt = $conn->prepare("SELECT marked_number, estimation_number, customer_name, phone_number, discount, total_amount, marked_at 
                            FROM marked_estimations 
                            ORDER BY marked_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $markedEstimations[] = $row;
        }
    }

    // 2. Fetch items for each marked estimation and join with products table
    foreach ($markedEstimations as &$estimation) {
        $markedNumber = $estimation['marked_number'];
        $itemsStmt = $conn->prepare(
            "SELECT marked_estimation_items.product_id, marked_estimation_items.quantity, marked_estimation_items.price_per_unit, products.name AS product_name 
             FROM marked_estimation_items 
             JOIN products ON marked_estimation_items.product_id = products.product_id 
             WHERE marked_estimation_items.marked_number = ?"
        );
        $itemsStmt->bind_param("s", $markedNumber);
        $itemsStmt->execute();
        $itemsResult = $itemsStmt->get_result();

        $items = [];
        while ($itemRow = $itemsResult->fetch_assoc()) {
            $items[] = $itemRow;
        }
        $estimation['items'] = $items;
    }

    echo json_encode(["status" => "success", "data" => $markedEstimations]);

} catch (mysqli_sql_exception $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}

$conn->close();
?>