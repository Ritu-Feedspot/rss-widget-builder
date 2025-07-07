<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once '../../db/connect.php';

try {
    $db = new Database();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $sql = "INSERT INTO folders (name, created_at) VALUES (?, NOW())";
    $folderId = $db->insert($sql, [$input['name']]);
    
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
?>
