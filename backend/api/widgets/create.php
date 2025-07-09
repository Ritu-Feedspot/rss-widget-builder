<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
require_once '../../db/connect.php';
require_once '../../classes/Auth.php';

try {
    $auth = new Auth();
    $auth->requireLogin(); // Require user to be logged in
    
    $db = new Database();
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Group settings into JSON objects by section
    $generalSettings = json_encode([
        'width' => $input['width'] ?? 350,
        'height' => $input['height'] ?? 400,
        'responsive' => $input['responsive'] ?? false,
        'view_type' => $input['viewType'] ?? 'list',
        'font_style' => $input['fontStyle'] ?? 'Arial',
        'text_align' => $input['textAlign'] ?? 'left',
        'show_border' => $input['showBorder'] ?? false,
        'border_color' => $input['borderColor'] ?? '#dbdbdb',
        'corner_style' => $input['cornerStyle'] ?? 'square',
        'content_bg_color' => $input['contentBgColor'] ?? '#ffffff'
    ]);
    
    $feedTitleSettings = json_encode([
        'title' => $input['title'] ?? '',
        'title_size' => $input['titleSize'] ?? 16,
        'title_color' => $input['titleColor'] ?? '#000000',
        'title_bold' => $input['titleBold'] ?? false,
        'custom_title' => $input['customTitle'] ?? false,
        'title_link' => $input['titleLink'] ?? '',
        'title_bg_color' => $input['titleBgColor'] ?? '#ffffff'
    ]);
    
    $feedContentSettings = json_encode([
        'post_count' => $input['postCount'] ?? 5,
        'show_author' => $input['showAuthor'] ?? false,
        'show_date' => $input['showDate'] ?? false,
        'date_format' => $input['dateFormat'] ?? 'long',
        'show_title' => $input['showTitle'] ?? true,
        'bold_title' => $input['boldTitle'] ?? false,
        'max_title_chars' => $input['maxTitleChars'] ?? 55,
        'content_title_size' => $input['contentTitleSize'] ?? 14,
        'content_title_color' => $input['contentTitleColor'] ?? '#000000',
        'show_original_link' => $input['showOriginalLink'] ?? false
    ]);
    
    $followingViewsSettings = json_encode([
        // Add any following/views specific settings here
        // This can be expanded based on your requirements
    ]);
    
    // Insert with grouped JSON settings
    $sql = "INSERT INTO widgets (
        user_id, name, feed_url, selected_folder, 
        general_settings, feed_title_settings, feed_content_settings, following_views_settings,
        created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $params = [
        $_SESSION['user_id'],
        $input['name'] ?? 'Untitled Widget',
        $input['feedUrl'] ?? '',
        $input['selectedFolder'] ?? '',
        $generalSettings,
        $feedTitleSettings,
        $feedContentSettings,
        $followingViewsSettings
    ];
    
    $widgetId = $db->insert($sql, $params);
    
    echo json_encode([
        'success' => true,
        'id' => $widgetId,
        'message' => 'Widget created successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
