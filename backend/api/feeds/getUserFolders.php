<?php
// CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

require_once '../../db/connect.php';
require_once '../../classes/Auth.php';

try {
    $auth = new Auth();
    $auth->requireLogin(); 

    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Authentication required'
        ]);
        exit;
    }

    $db = new Database();

    // Only folders owned by this user
    $sql = "SELECT f.*, COUNT(uff.id) AS feed_count
            FROM folders f
            LEFT JOIN user_followed_feeds uff ON f.id = uff.folder_id
            WHERE f.user_id = ?
            GROUP BY f.id
            ORDER BY f.name";

    $folders = $db->fetchAll($sql, [$userId]);

    echo json_encode($folders);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
