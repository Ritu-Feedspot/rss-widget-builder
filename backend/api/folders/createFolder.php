<?php
// CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

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

    if (empty($input['name'])) {
        throw new Exception("Folder name is required.");
    }

    //  Insert with user_id
    $sql = "INSERT INTO folders (user_id, name, created_at) VALUES (?, ?, NOW())";
    $folderId = $db->insert($sql, [$userId, $input['name']]);

    echo json_encode([
        'success' => true,
        'id' => $folderId,
        'name' => $input['name'],
        'message' => 'Folder created successfully'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
