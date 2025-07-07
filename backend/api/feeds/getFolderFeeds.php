<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

require_once '../../db/connect.php';
require_once '../rss/parseRSS.php';

try {
    $db = new Database();
    $folderId = $_GET['folderId'] ?? null;
    
    if (!$folderId) {
        throw new Exception('Folder ID is required');
    }
    
    // Get all feeds in the folder
    $sql = "SELECT f.rss_url, f.title as feed_title
            FROM feeds f
            JOIN user_followed_feeds uff ON f.id = uff.feed_id
            WHERE uff.folder_id = ?
            ORDER BY f.title";
    
    $feeds = $db->fetchAll($sql, [$folderId]);
    
    if (empty($feeds)) {
        echo json_encode([
            'feed_title' => 'Empty Folder',
            'items' => []
        ]);
        exit;
    }
    
    $parser = new RSSParser();
    $allItems = [];
    $folderTitle = '';
    
    // Parse each feed and combine items
    foreach ($feeds as $feed) {
        $feedData = $parser->getFeedData($feed['rss_url']);
        
        if (!isset($feedData['error']) && !empty($feedData['items'])) {
            // Add feed source to each item
            foreach ($feedData['items'] as $item) {
                $item['feed_source'] = $feed['feed_title'];
                $allItems[] = $item;
            }
            
            if (empty($folderTitle)) {
                $folderTitle = 'Mixed Feed';
            }
        }
    }
    
    // Sort items by date (newest first)
    usort($allItems, function($a, $b) {
        return strtotime($b['pub_date']) - strtotime($a['pub_date']);
    });
    
    // Limit to 20 items
    $allItems = array_slice($allItems, 0, 20);
    
    echo json_encode([
        'feed_title' => $folderTitle,
        'items' => $allItems
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'feed_title' => 'Error Loading Folder',
        'items' => []
    ]);
}
?>
