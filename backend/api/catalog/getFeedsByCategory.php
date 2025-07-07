<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once '../../db/connect.php';

try {
    $db = new Database();
    $categoryId = $_GET['category'] ?? null;
    
    if (!$categoryId) {
        throw new Exception('Category ID is required');
    }
    
    $sql = "SELECT f.*, COUNT(fp.id) as post_count 
            FROM feeds f 
            LEFT JOIN feed_posts fp ON f.id = fp.feed_id 
            WHERE f.category_id = ? 
            GROUP BY f.id 
            ORDER BY f.title";
    
    $feeds = $db->fetchAll($sql, [$categoryId]);
    
    echo json_encode($feeds);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
