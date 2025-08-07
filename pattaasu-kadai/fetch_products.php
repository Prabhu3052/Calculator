<?php
require 'db_config.php';

// Selects all columns EXCEPT the image column.
$sql = "SELECT id, name, tamilName, originalPrice, offerPrice, category, priceHistory, last_updated FROM products";
$result = $conn->query($sql);
$products = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $row['originalPrice'] = (float)$row['originalPrice'];
        $row['offerPrice'] = (float)$row['offerPrice'];
        $row['priceHistory'] = json_decode($row['priceHistory']);
        $products[] = $row;
    }
}

echo json_encode($products);
$conn->close();
?>