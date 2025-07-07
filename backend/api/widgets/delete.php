<?php
require_once '../../db/connect.php';

try {
    $db = new Database();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $sql = "DELETE FROM widgets WHERE id = ?";
    $affected = $db->delete($sql, [$input['id']]);
    
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
