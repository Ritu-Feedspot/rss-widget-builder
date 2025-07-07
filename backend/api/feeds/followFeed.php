<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

require_once '../../db/connect.php';

try {
    $db = new Database();
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Check if already following
    $checkSql = "SELECT id FROM user_followed_feeds WHERE feed_id = ? AND folder_id = ?";
    $existing = $db->fetchOne($checkSql, [$input['feedId'], $input['folderId']]);
    
    if ($existing) {
        echo json_encode([
            'success' => false,
            'message' => 'Already following this feed'
        ]);
        exit;
    }
    
    $sql = "INSERT INTO user_followed_feeds (feed_id, folder_id, created_at) VALUES (?, ?, NOW())";
    $id = $db->insert($sql, [$input['feedId'], $input['folderId']]);
    
    echo json_encode([
        'success' => true,
        'id' => $id,
        'message' => 'Feed followed successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
