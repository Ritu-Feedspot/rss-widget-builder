<?php
require_once '../../db/connect.php';
require_once '../../classes/Auth.php';

try {
    $auth = new Auth();
    $auth->requireLogin(); // Require user to be logged in
    
    $db = new Database();
    
    if (isset($_GET['id'])) {
        // Get single widget
        $sql = "SELECT * FROM widgets WHERE id = ? AND user_id = ?";
        $widget = $db->fetchOne($sql, [$_GET['id'], $_SESSION['user_id']]);
        
        if ($widget) {
            // Decode JSON settings
            $widget['general_settings'] = json_decode($widget['general_settings'], true);
            $widget['feed_title_settings'] = json_decode($widget['feed_title_settings'], true);
            $widget['feed_content_settings'] = json_decode($widget['feed_content_settings'], true);
            $widget['following_views_settings'] = json_decode($widget['following_views_settings'], true);
            
            echo json_encode([
                'success' => true,
                'widget' => $widget
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Widget not found'
            ]);
        }
    } else {
        // Get all widgets for user
        $sql = "SELECT * FROM widgets WHERE user_id = ? ORDER BY created_at DESC";
        $widgets = $db->fetchAll($sql, [$_SESSION['user_id']]);
        
        // Decode JSON settings for each widget
        foreach ($widgets as &$widget) {
            $widget['general_settings'] = json_decode($widget['general_settings'], true);
            $widget['feed_title_settings'] = json_decode($widget['feed_title_settings'], true);
            $widget['feed_content_settings'] = json_decode($widget['feed_content_settings'], true);
            $widget['following_views_settings'] = json_decode($widget['following_views_settings'], true);
        }
        
        echo json_encode([
            'success' => true,
            'widgets' => $widgets
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
