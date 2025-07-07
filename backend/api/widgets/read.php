<?php
require_once '../../db/connect.php';
require_once '../../classes/Auth.php';

try {
    $auth = new Auth();
    $auth->requireLogin();
    
    $db = new Database();
    
    // Only get widgets for the current user
    $sql = "SELECT * FROM widgets WHERE user_id = ? ORDER BY created_at DESC";
    $widgets = $db->fetchAll($sql, [$_SESSION['user_id']]);
    
    echo json_encode($widgets);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
