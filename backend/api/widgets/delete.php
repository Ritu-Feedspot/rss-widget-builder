<?php
// Enable CORS
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
require_once '../../db/connect.php';
require_once '../../classes/Auth.php';
$auth = new Auth();
$auth->requireLogin();  // Enforce session login



try {
    $db = new Database();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $sql = "DELETE FROM widgets WHERE id = ? AND user_id = ?";
    $affected = $db->delete($sql, [$input['id'], $_SESSION['user_id']]);
    
    echo json_encode([
        'success' => true,
        'affected_rows' => $affected,
        'message' => 'Widget deleted successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
