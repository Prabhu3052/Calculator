<?php
require 'db_config.php';
header('Content-Type: application/json');

try {
    $json_data = file_get_contents('php://input');
    $payload = json_decode($json_data, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($payload) || !isset($payload['products']) || !isset($payload['toDelete'])) {
        throw new Exception('Invalid JSON data received from client.');
    }

    $client_products = $payload['products'];
    $ids_to_delete = $payload['toDelete'];

    // Get all current IDs from the database
    $stmt = $conn->prepare("SELECT id FROM products");
    $stmt->execute();
    $result = $stmt->get_result();
    $db_ids = [];
    while ($row = $result->fetch_assoc()) {
        $db_ids[] = $row['id'];
    }
    $stmt->close();

    // Get all IDs from the client's product list
    $client_ids = array_map(function($p) { return $p['id']; }, $client_products);

    // Calculate which IDs to insert or update based on the product list
    $ids_to_insert = array_diff($client_ids, $db_ids);
    $ids_to_update = array_intersect($client_ids, $db_ids);

    $conn->begin_transaction();
    $inserted_count = 0; $updated_count = 0; $deleted_count = 0;

    // ## MAATRAM SEIYAPATTA PAGUTHI ##
    // Client anuppiya 'toDelete' array-il ulla IDs-ai mattum neekkavum.
    if (!empty($ids_to_delete)) {
        // Ensure IDs are integers to prevent SQL injection
        $ids_to_delete_int = array_map('intval', $ids_to_delete);
        $placeholders = implode(',', array_fill(0, count($ids_to_delete_int), '?'));
        $types = str_repeat('i', count($ids_to_delete_int));
        
        $stmt_delete = $conn->prepare("DELETE FROM products WHERE id IN ($placeholders)");
        $stmt_delete->bind_param($types, ...$ids_to_delete_int);
        $stmt_delete->execute();
        $deleted_count = $stmt_delete->affected_rows;
        $stmt_delete->close();
    }

    // Handle Inserts and Updates
    $stmt_insert = $conn->prepare("INSERT INTO products (id, name, tamilName, originalPrice, offerPrice, category, priceHistory, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt_update = $conn->prepare("UPDATE products SET name=?, tamilName=?, originalPrice=?, offerPrice=?, category=?, priceHistory=?, last_updated=NOW() WHERE id=?");

    foreach ($client_products as $product) {
        $priceHistoryJson = json_encode($product['priceHistory']);

        if (in_array($product['id'], $ids_to_insert)) {
            $stmt_insert->bind_param("issddss", $product['id'], $product['name'], $product['tamilName'], $product['originalPrice'], $product['offerPrice'], $product['category'], $priceHistoryJson);
            $stmt_insert->execute();
            $inserted_count++;
        } elseif (in_array($product['id'], $ids_to_update)) {
            $stmt_update->bind_param("ssddssi", $product['name'], $product['tamilName'], $product['originalPrice'], $product['offerPrice'], $product['category'], $priceHistoryJson, $product['id']);
            $stmt_update->execute();
            $updated_count++;
        }
    }
    $stmt_insert->close();
    $stmt_update->close();
    $conn->commit();

    echo json_encode([
        'status' => 'success',
        'message' => "Sync complete! Products inserted: $inserted_count, updated: $updated_count, deleted: $deleted_count."
    ]);

} catch (Exception $e) {
    if ($conn->ping()) {
        $conn->rollback();
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if ($conn->ping()) {
        $conn->close();
    }
}
?>