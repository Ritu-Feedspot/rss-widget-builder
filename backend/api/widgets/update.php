<?php
require_once '../../db/connect.php';

try {
    $db = new Database();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $sql = "UPDATE widgets SET 
        name = ?, feed_url = ?, selected_folder = ?, width = ?, height = ?, 
        responsive = ?, title = ?, title_size = ?, title_color = ?, 
        title_bold = ?, show_author = ?, show_date = ?, post_count = ?,
        view_type = ?, font_style = ?, text_align = ?, show_border = ?,
        border_color = ?, corner_style = ?, updated_at = NOW()
        WHERE id = ?";
    
    $params = [
        $input['name'],
        $input['feedUrl'],
        $input['selectedFolder'],
        $input['width'],
        $input['height'],
        $input['responsive'] ? 1 : 0,
        $input['title'],
        $input['titleSize'],
        $input['titleColor'],
        $input['titleBold'] ? 1 : 0,
        $input['showAuthor'] ? 1 : 0,
        $input['showDate'] ? 1 : 0,
        $input['postCount'],
        $input['viewType'],
        $input['fontStyle'],
        $input['textAlign'],
        $input['showBorder'] ? 1 : 0,
        $input['borderColor'],
        $input['cornerStyle'],
        $input['id']
    ];
    
    $affected = $db->update($sql, $params);
    
    echo json_encode([
        'success' => true,
        'affected_rows' => $affected,
        'message' => 'Widget updated successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
