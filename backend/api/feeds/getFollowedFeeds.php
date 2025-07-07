<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
require_once '../../db/connect.php';

try {
    $db = new Database();
    
    $sql = "SELECT f.*, uff.folder_id, fo.name as folder_name
            FROM feeds f
            JOIN user_followed_feeds uff ON f.id = uff.feed_id
            JOIN folders fo ON uff.folder_id = fo.id
            ORDER BY fo.name, f.title";
    
    $followedFeeds = $db->fetchAll($sql);
    
    echo json_encode($followedFeeds);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
