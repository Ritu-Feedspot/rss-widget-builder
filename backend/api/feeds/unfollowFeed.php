<?php
// CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../db/connect.php';
require_once '../../classes/Auth.php';

try {
    $auth = new Auth();
    $auth->requireLogin(); // 🔐 Auth check

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
    $input = json_decode(file_get_contents('php://input'), true);

    $feedId = $input['feedId'] ?? null;
    $folderId = $input['folderId'] ?? null;

    if (!$feedId || !$folderId) {
        throw new Exception("Feed ID and Folder ID are required.");
    }

    // Verify that the user is actually following this feed in this folder
    // This prevents unauthorized unfollowing or unfollowing non-existent relationships
    $checkSql = "SELECT id FROM user_followed_feeds WHERE feed_id = ? AND folder_id = ? AND user_id = ?";
    $existingFollow = $db->fetchOne($checkSql, [$feedId, $folderId, $userId]);

    if (!$existingFollow) {
        http_response_code(404); // Not Found, or Forbidden if trying to unfollow someone else's
        echo json_encode([
            'success' => false,
            'message' => 'Feed not found in this folder for the current user, or already unfollowed.'
        ]);
        exit;
    }

    // Delete the follow relationship
    $deleteSql = "DELETE FROM user_followed_feeds WHERE feed_id = ? AND folder_id = ? AND user_id = ?";
    $affectedRows = $db->delete($deleteSql, [$feedId, $folderId, $userId]);

    echo json_encode([
        'success' => true,
        'affected_rows' => $affectedRows,
        'message' => 'Feed unfollowed successfully.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
