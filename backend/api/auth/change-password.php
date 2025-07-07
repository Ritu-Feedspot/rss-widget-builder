<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once '../../classes/Auth.php';

try {
    $auth = new Auth();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $result = $auth->changePassword(
        $input['currentPassword'] ?? '',
        $input['newPassword'] ?? ''
    );
    
    if (!$result['success']) {
        http_response_code(400);
    }
    
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
