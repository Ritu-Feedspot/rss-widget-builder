<?php
// CORS and content headers
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Dependencies
require_once '../../db/connect.php';
require_once '../../classes/Auth.php';
require_once '../rss/parseRSS.php';

try {
    // Auth check
    $auth = new Auth();
    $auth->requireLogin(); // Will start session and validate

    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'error' => 'Authentication required',
            'feed_title' => 'Unauthenticated',
            'items' => []
        ]);
        exit;
    }

    $db = new Database();
    $folderId = $_GET['folderId'] ?? null;

    if (!$folderId) {
        throw new Exception('Folder ID is required');
    }

    // Ensure folder belongs to the logged-in user
    $folderCheck = $db->fetchOne("SELECT id FROM folders WHERE id = ? AND user_id = ?", [$folderId, $userId]);
    if (!$folderCheck) {
        http_response_code(403);
        echo json_encode([
            'error' => 'Access denied: Folder does not belong to user',
            'feed_title' => 'Unauthorized',
            'items' => []
        ]);
        exit;
    }

    // Get all feeds in this folder for the user
    $sql = "SELECT f.rss_url, f.title AS feed_title
            FROM feeds f
            JOIN user_followed_feeds uff ON f.id = uff.feed_id
            WHERE uff.folder_id = ? AND uff.user_id = ?
            ORDER BY f.title";

    $feeds = $db->fetchAll($sql, [$folderId, $userId]);

    if (empty($feeds)) {
        echo json_encode([
            'feed_title' => 'Empty Folder',
            'items' => []
        ]);
        exit;
    }

    $parser = new RSSParser();
    $allItems = [];
    $folderTitle = 'Mixed Feed';

    foreach ($feeds as $feed) {
    try {
        $feedData = $parser->getFeedData($feed['rss_url']);

        if (!isset($feedData['error']) && !empty($feedData['items'])) {
            foreach ($feedData['items'] as $item) {
                $item['feed_source'] = $feed['feed_title'];
                $allItems[] = $item;
            }
        }
    } catch (Exception $e) {
        // Optionally log the error
        error_log("Skipping feed: {$feed['rss_url']} — " . $e->getMessage());
        continue;
    }
}


    // Sort items by date descending
    usort($allItems, function ($a, $b) {
        return strtotime($b['pub_date']) - strtotime($a['pub_date']);
    });

    // // Limit to 20
    // $allItems = array_slice($allItems, 0, 20);

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
