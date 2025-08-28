<?php
header('Content-Type: application/json');

include 'db_config.php';

// Get the raw POST data
$json_data = file_get_contents('php://input');
$request = json_decode($json_data, true);

if (!isset($request['action'])) {
    echo json_encode(['status' => 'error', 'message' => 'No action specified.']);
    exit();
}

$action = $request['action'];

if ($action === 'get_all') {
    // Action to fetch all enquiries and their counts
    $sql = "SELECT enquiry_id, customer_name, phone_number, complete, date FROM enquiry ORDER BY date DESC";
    $result = $conn->query($sql);
    
    // Get counts
    $sql_pending_count = "SELECT COUNT(*) AS count FROM enquiry WHERE complete = 0";
    $result_pending_count = $conn->query($sql_pending_count);
    $pending_count = $result_pending_count->fetch_assoc()['count'];

    $sql_complete_count = "SELECT COUNT(*) AS count FROM enquiry WHERE complete = 1";
    $result_complete_count = $conn->query($sql_complete_count);
    $complete_count = $result_complete_count->fetch_assoc()['count'];

    if ($result) {
        $enquiries = [];
        while ($row = $result->fetch_assoc()) {
            $enquiries[] = $row;
        }
        echo json_encode([
            'status' => 'success', 
            'enquiries' => $enquiries,
            'counts' => ['pending' => $pending_count, 'complete' => $complete_count]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Query failed: ' . $conn->error]);
    }

} else if ($action === 'get_enquiry_details') {
    // Action to fetch details for a specific enquiry
    if (!isset($request['enquiry_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Enquiry ID not specified.']);
        exit();
    }

    $enquiry_id = $request['enquiry_id'];

    $sql_enquiry = "SELECT * FROM enquiry WHERE enquiry_id = ?";
    $stmt_enquiry = $conn->prepare($sql_enquiry);
    $stmt_enquiry->bind_param("i", $enquiry_id);
    $stmt_enquiry->execute();
    $result_enquiry = $stmt_enquiry->get_result();
    $enquiry = $result_enquiry->fetch_assoc();
    $stmt_enquiry->close();

    if ($enquiry) {
        $sql_items = "SELECT product_id, quantity FROM enquiry_items WHERE enquiry_id = ?";
        $stmt_items = $conn->prepare($sql_items);
        $stmt_items->bind_param("i", $enquiry_id);
        $stmt_items->execute();
        $result_items = $stmt_items->get_result();
        $items = [];
        while ($row = $result_items->fetch_assoc()) {
            $items[] = $row;
        }
        $stmt_items->close();
        
        $enquiry['items'] = $items;

        echo json_encode(['status' => 'success', 'enquiry' => $enquiry]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Enquiry not found.']);
    }

} else if ($action === 'mark_as_complete') {
    // New action to mark an enquiry as complete
    if (!isset($request['enquiry_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Enquiry ID not specified.']);
        exit();
    }

    $enquiry_id = $request['enquiry_id'];
    
    $sql_update = "UPDATE enquiry SET complete = 1 WHERE enquiry_id = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("i", $enquiry_id);

    if ($stmt_update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Enquiry marked as complete.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update enquiry: ' . $stmt_update->error]);
    }
    $stmt_update->close();

} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action specified.']);
}

$conn->close();
?>