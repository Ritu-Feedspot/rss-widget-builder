<?php
// CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Auth & DB
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

    // Only fetch feeds for this user's folders
    $sql = "SELECT f.*, uff.folder_id, fo.name AS folder_name
            FROM feeds f
            JOIN user_followed_feeds uff ON f.id = uff.feed_id
            JOIN folders fo ON uff.folder_id = fo.id
            WHERE fo.user_id = ?
            ORDER BY fo.name, f.title";

    $followedFeeds = $db->fetchAll($sql, [$userId]);

    echo json_encode($followedFeeds);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
