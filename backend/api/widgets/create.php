<?php
require_once '../../db/connect.php';
require_once '../../classes/Auth.php';

try {
    $auth = new Auth();
    $auth->requireLogin(); // Require user to be logged in
    
    $db = new Database();
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Add user_id to the widget creation
    $sql = "INSERT INTO widgets (
        user_id, name, feed_url, selected_folder, width, height, responsive,
        title, title_size, title_color, title_bold, show_author, show_date,
        post_count, view_type, font_style, text_align, show_border,
        border_color, corner_style, custom_title, title_link,
        title_bg_color, show_original_link, content_bg_color,
        date_format, show_title, bold_title, max_title_chars,
        content_title_size, content_title_color, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $params = [
        $_SESSION['user_id'], // Add user ID as first parameter
        $input['name'] ?? 'Untitled Widget',
        $input['feedUrl'] ?? '',
        $input['selectedFolder'] ?? '',
        $input['width'] ?? 350,
        $input['height'] ?? 400,
        $input['responsive'] ? 1 : 0,
        $input['title'] ?? '',
        $input['titleSize'] ?? 16,
        $input['titleColor'] ?? '#000000',
        $input['titleBold'] ? 1 : 0,
        $input['showAuthor'] ? 1 : 0,
        $input['showDate'] ? 1 : 0,
        $input['postCount'] ?? 5,
        $input['viewType'] ?? 'list',
        $input['fontStyle'] ?? 'Arial',
        $input['textAlign'] ?? 'left',
        $input['showBorder'] ? 1 : 0,
        $input['borderColor'] ?? '#dbdbdb',
        $input['cornerStyle'] ?? 'square',
        $input['customTitle'] ? 1 : 0,
        $input['titleLink'] ?? '',
        $input['titleBgColor'] ?? '#ffffff',
        $input['showOriginalLink'] ? 1 : 0,
        $input['contentBgColor'] ?? '#ffffff',
        $input['dateFormat'] ?? 'long',
        $input['showTitle'] ? 1 : 0,
        $input['boldTitle'] ? 1 : 0,
        $input['maxTitleChars'] ?? 55,
        $input['contentTitleSize'] ?? 14,
        $input['contentTitleColor'] ?? '#000000'
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
