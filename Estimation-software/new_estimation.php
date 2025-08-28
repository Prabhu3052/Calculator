<?php
header('Content-Type: application/json');
include 'db_config.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$data = json_decode(file_get_contents("php://input"), true);
$action = isset($data['action']) ? $data['action'] : 'add'; // Default action is 'add'

try {
    $conn->begin_transaction();

    // ACTION: UPDATE an existing estimation
    if ($action === 'update' && !empty($data['estimation_number'])) {
        $estimationNumber = $data['estimation_number'];

        // 1. Delete old items associated with this estimation
        $deleteItemsStmt = $conn->prepare("DELETE FROM estimation_items WHERE estimation_number = ?");
        $deleteItemsStmt->bind_param("s", $estimationNumber);
        $deleteItemsStmt->execute();

        // 2. Update the main estimation details
        $updateEstStmt = $conn->prepare("UPDATE estimations SET customer_name = ?, phone_number = ?, discount = ?, total_amount = ?, created_at = ? WHERE estimation_number = ?");
        $updateEstStmt->bind_param("ssdsss",
            $data['customer_name'],
            $data['phone_number'],
            $data['discount'],
            $data['total_amount'],
            $data['created_at'],
            $estimationNumber
        );
        $updateEstStmt->execute();

        // 3. Insert the updated list of items
        $itemStmt = $conn->prepare("INSERT INTO estimation_items (estimation_number, product_id, quantity) VALUES (?, ?, ?)");
        foreach ($data['items'] as $item) {
            $itemStmt->bind_param("ssi", $estimationNumber, $item['product_id'], $item['quantity']);
            $itemStmt->execute();
        }

        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Estimation updated successfully!", "estimation_number" => $estimationNumber]);

    // ACTION: MARK an existing estimation
    } else if ($action === 'mark' && !empty($data['estimation_number'])) {
        $estimationNumber = $data['estimation_number'];
        $is_marked_status = isset($data['is_marked']) ? (int)$data['is_marked'] : 0;
        
        // Update the 'is_marked' status in the main estimations table
        $updateMarkStmt = $conn->prepare("UPDATE estimations SET is_marked = ? WHERE estimation_number = ?");
        $updateMarkStmt->bind_param("is", $is_marked_status, $estimationNumber);
        $updateMarkStmt->execute();

        // If the status is 0, it means we need to delete the entry from the 'marked' tables
        if ($is_marked_status === 0) {
            // Delete from the marked_estimations table
            $deleteMarkedStmt = $conn->prepare("DELETE FROM marked_estimations WHERE estimation_number = ?");
            $deleteMarkedStmt->bind_param("s", $estimationNumber);
            $deleteMarkedStmt->execute();

            // The 'marked_estimation_items' table should have a foreign key constraint
            // with 'ON DELETE CASCADE' which would handle deleting the items automatically.
            // If not, you would need to add a line here to delete from that table as well.
            // e.g., $deleteMarkedItemsStmt = $conn->prepare("DELETE FROM marked_estimation_items WHERE marked_number IN (SELECT marked_number FROM marked_estimations WHERE estimation_number = ?)");
        }

        $conn->commit();
        $message = $is_marked_status === 1 ? "Estimation marked successfully!" : "Estimation unmarked successfully!";
        echo json_encode(["status" => "success", "message" => $message]);
        
    // ACTION: ADD a new estimation (original logic)
    } else if ($action === 'unmark' && !empty($data['estimation_number'])) {
        $estimationNumber = $data['estimation_number'];

        // 1. Delete from marked_estimation_items table first (if foreign key is not set to cascade)
        $deleteItemsStmt = $conn->prepare("DELETE FROM marked_estimation_items WHERE marked_number IN (SELECT marked_number FROM marked_estimations WHERE estimation_number = ?)");
        $deleteItemsStmt->bind_param("s", $estimationNumber);
        $deleteItemsStmt->execute();

        // 2. Delete from the main marked_estimations table
        $deleteMarkedStmt = $conn->prepare("DELETE FROM marked_estimations WHERE estimation_number = ?");
        $deleteMarkedStmt->bind_param("s", $estimationNumber);
        $deleteMarkedStmt->execute();

        // 3. Update the 'is_marked' status in the main estimations table
        $updateMarkStmt = $conn->prepare("UPDATE estimations SET is_marked = 0 WHERE estimation_number = ?");
        $updateMarkStmt->bind_param("s", $estimationNumber);
        $updateMarkStmt->execute();

        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Estimation unmarked successfully!"]);
    } 
    
    else {
        
        // 1. Fetch the last estimation number from the counter table
        $counterStmt = $conn->prepare("SELECT last_estimation_number FROM counter WHERE id = 1 FOR UPDATE");
        $counterStmt->execute();
        $counterResult = $counterStmt->get_result();
        $last_est_num = $counterResult->fetch_assoc()['last_estimation_number'];
        
        // Generate the new estimation number
        $lastNum = (int)substr($last_est_num, 1);
        $newNum = 'E' . ($lastNum + 1);

        // 2. Save the main estimation details
        $estStmt = $conn->prepare("INSERT INTO estimations (estimation_number, customer_name, phone_number, discount, total_amount, created_at) VALUES (?, ?, ?, ?, ?, ?)");
        $estStmt->bind_param("sssdss",
            $newNum,
            $data['customer_name'],
            $data['phone_number'],
            $data['discount'],
            $data['total_amount'],
            $data['created_at']
        );
        $estStmt->execute();

        // 3. Save each item in the estimation
        $itemStmt = $conn->prepare("INSERT INTO estimation_items (estimation_number, product_id, quantity) VALUES (?, ?, ?)");
        foreach ($data['items'] as $item) {
            $itemStmt->bind_param("ssi", $newNum, $item['product_id'], $item['quantity']);
            $itemStmt->execute();
        }
        
        // 4. Update the counter table with the new estimation number
        $updateCounterStmt = $conn->prepare("UPDATE counter SET last_estimation_number = ? WHERE id = 1");
        $updateCounterStmt->bind_param("s", $newNum);
        $updateCounterStmt->execute();

        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Estimation saved successfully!", "estimation_number" => $newNum]);
    }
    
} catch (mysqli_sql_exception $e) {
    $conn->rollback();
    // Return a more detailed error message for debugging
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage(), "line" => $e->getLine()]);
}

$conn->close();
?>