<?php
// CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

require_once '../../db/connect.php';
require_once '../../classes/Auth.php';

try {
    // 🔐 Auth & session
    $auth = new Auth();
    $auth->requireLogin();

    $db = new Database();
    $input = json_decode(file_get_contents('php://input'), true);

    $userId = $_SESSION['user_id'] ?? null;
    $feedId = $input['feedId'] ?? null;
    $folderId = $input['folderId'] ?? null;

    if (!$feedId || !$folderId) {
        throw new Exception("Feed ID and Folder ID are required");
    }

    // ✅ Verify that the folder belongs to the current user
    $folderCheck = $db->fetchOne("SELECT id FROM folders WHERE id = ? AND user_id = ?", [$folderId, $userId]);
    if (!$folderCheck) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Access denied. Folder does not belong to you.'
        ]);
        exit;
    }

    // ✅ Check if feed already followed by user in this folder
    $checkSql = "SELECT id FROM user_followed_feeds WHERE feed_id = ? AND folder_id = ?";
    $existing = $db->fetchOne($checkSql, [$feedId, $folderId]);

    if ($existing) {
        echo json_encode([
            'success' => false,
            'message' => 'Already following this feed in this folder.'
        ]);
        exit;
    }

    // ✅ Insert follow record
    $insertSql = "INSERT INTO user_followed_feeds (feed_id, folder_id, created_at) VALUES (?, ?, NOW())";
    $id = $db->insert($insertSql, [$feedId, $folderId]);

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
