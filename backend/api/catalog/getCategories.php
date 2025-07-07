<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once '../../db/connect.php';

try {
    $db = new Database();
    
    $sql = "SELECT c.*, COUNT(f.id) as feed_count 
            FROM categories c 
            LEFT JOIN feeds f ON c.id = f.category_id 
            GROUP BY c.id 
            ORDER BY c.name";
    
    $categories = $db->fetchAll($sql);
    
    echo json_encode($categories);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
