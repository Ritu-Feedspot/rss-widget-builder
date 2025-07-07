<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once '../../db/connect.php';

class RSSParser {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    public function parseRSSFeed($url) {
        try {
            // Enable libxml to use internal errors
            libxml_use_internal_errors(true);
            
            // Create context with user agent to avoid blocking
            $context = stream_context_create([
                'http' => [
                    'user_agent' => 'Mozilla/5.0 (compatible; RSS Widget Builder/1.0)',
                    'timeout' => 30
                ]
            ]);
            
            $xmlContent = file_get_contents($url, false, $context);

            if ($xmlContent === false) {
            echo json_encode([
                "error" => "Failed to fetch RSS feed content",
                "feed_title" => "Error Loading Feed",
                "items" => []
            ]);
            exit;
            }

            // Load RSS feed
            $rss = simplexml_load_string($xmlContent, "SimpleXMLElement", LIBXML_NOCDATA);
            
            if ($rss === false) {
                throw new Exception('Failed to parse RSS feed');
            }
            
            $feedData = [];
            
            // Parse RSS 2.0 format
            if (isset($rss->channel)) {
                $feedData = $this->parseRSS2($rss);
            }
            // Parse Atom format
            elseif (isset($rss->entry)) {
                $feedData = $this->parseAtom($rss);
            }
            else {
                throw new Exception('Unsupported RSS format');
            }
            
            return $feedData;
            
        } catch (Exception $e) {
            error_log("RSS Parse Error: " . $e->getMessage());
            return [
                'error' => $e->getMessage(),
                'feed_title' => 'Error Loading Feed',
                'items' => []
            ];
        }
    }
    
    private function parseRSS2($rss) {
        $feedData = [
            'feed_title' => (string)$rss->channel->title,
            'feed_description' => (string)$rss->channel->description,
            'feed_link' => (string)$rss->channel->link,
            'feed_image' => '',
            'items' => []
        ];
        
        // Get feed image
        if (isset($rss->channel->image->url)) {
            $feedData['feed_image'] = (string)$rss->channel->image->url;
        }
        
        // Parse items
        foreach ($rss->channel->item as $item) {
            $feedItem = [
                'title' => (string)$item->title,
                'description' => $this->cleanDescription((string)$item->description),
                'link' => (string)$item->link,
                'pub_date' => $this->parseDate((string)$item->pubDate),
                'author' => $this->extractAuthor($item),
                'image' => $this->extractImage($item)
            ];
            
            $feedData['items'][] = $feedItem;
        }
        
        return $feedData;
    }
    
    private function parseAtom($rss) {
        $feedData = [
            'feed_title' => (string)$rss->title,
            'feed_description' => (string)$rss->subtitle,
            'feed_link' => '',
            'feed_image' => '',
            'items' => []
        ];
        
        // Get feed link
        foreach ($rss->link as $link) {
            if ((string)$link['rel'] === 'alternate') {
                $feedData['feed_link'] = (string)$link['href'];
                break;
            }
        }
        
        // Parse entries
        foreach ($rss->entry as $entry) {
            $feedItem = [
                'title' => (string)$entry->title,
                'description' => $this->cleanDescription((string)$entry->summary),
                'link' => '',
                'pub_date' => $this->parseDate((string)$entry->published),
                'author' => (string)$entry->author->name,
                'image' => $this->extractImageFromAtom($entry)
            ];
            
            // Get entry link
            foreach ($entry->link as $link) {
                if ((string)$link['rel'] === 'alternate') {
                    $feedItem['link'] = (string)$link['href'];
                    break;
                }
            }
            
            $feedData['items'][] = $feedItem;
        }
        
        return $feedData;
    }
    
    private function extractAuthor($item) {
        // Try different author fields
        if (isset($item->author)) {
            return (string)$item->author;
        }
        if (isset($item->children('dc', true)->creator)) {
            return (string)$item->children('dc', true)->creator;
        }
        return '';
    }
    
    private function extractImage($item) {
        // Try to extract image from various sources
        
        // Media RSS namespace
        $media = $item->children('media', true);
        if (isset($media->thumbnail)) {
            return (string)$media->thumbnail['url'];
        }
        if (isset($media->content)) {
            $type = (string)$media->content['type'];
            if (strpos($type, 'image') !== false) {
                return (string)$media->content['url'];
            }
        }
        
        // Enclosure
        if (isset($item->enclosure)) {
            $type = (string)$item->enclosure['type'];
            if (strpos($type, 'image') !== false) {
                return (string)$item->enclosure['url'];
            }
        }
        
        // Extract from description
        $description = (string)$item->description;
        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $description, $matches)) {
            return $matches[1];
        }
        
        return '';
    }
    
    private function extractImageFromAtom($entry) {
        // Try to extract image from Atom entry
        foreach ($entry->link as $link) {
            $type = (string)$link['type'];
            if (strpos($type, 'image') !== false) {
                return (string)$link['href'];
            }
        }
        
        // Extract from content
        $content = (string)$entry->content;
        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $content, $matches)) {
            return $matches[1];
        }
        
        return '';
    }
    
    private function cleanDescription($description) {
        // Remove HTML tags and limit length
        $clean = strip_tags($description);
        $clean = html_entity_decode($clean, ENT_QUOTES, 'UTF-8');
        $clean = trim($clean);
        
        // Limit to 200 characters
        if (strlen($clean) > 200) {
            $clean = substr($clean, 0, 200) . '...';
        }
        
        return $clean;
    }
    
    private function parseDate($dateString) {
        if (empty($dateString)) {
            return date('Y-m-d H:i:s');
        }
        
        try {
            $timestamp = strtotime($dateString);
            if ($timestamp === false) {
                return date('Y-m-d H:i:s');
            }
            return date('Y-m-d H:i:s', $timestamp);
        } catch (Exception $e) {
            return date('Y-m-d H:i:s');
        }
    }
    
    public function getFeedData($feedUrl) {
        // Check if we have cached data
        $cachedData = $this->getCachedFeedData($feedUrl);
        if ($cachedData && $this->isCacheValid($cachedData['updated_at'])) {
            return json_decode($cachedData['data'], true);
        }
        
        // Parse fresh data
        $feedData = $this->parseRSSFeed($feedUrl);
        
        // Cache the data
        $this->cacheFeedData($feedUrl, $feedData);
        
        return $feedData;
    }
    
    private function getCachedFeedData($feedUrl) {
        $sql = "SELECT data, updated_at FROM rss_cache WHERE feed_url = ?";
        return $this->db->fetchOne($sql, [$feedUrl]);
    }
    
    private function isCacheValid($updatedAt, $cacheMinutes = 30) {
        $cacheTime = strtotime($updatedAt);
        $currentTime = time();
        return ($currentTime - $cacheTime) < ($cacheMinutes * 60);
    }
    
    private function cacheFeedData($feedUrl, $data) {
        $sql = "INSERT INTO rss_cache (feed_url, data, updated_at) 
                VALUES (?, ?, NOW()) 
                ON DUPLICATE KEY UPDATE data = ?, updated_at = NOW()";
        
        $jsonData = json_encode($data);
        $this->db->query($sql, [$feedUrl, $jsonData, $jsonData]);
    }
}

// Handle API request
try {
    $input = json_decode(file_get_contents('php://input'), true);
    $feedUrl = $input['feedUrl'] ?? $_GET['feedUrl'] ?? null;
    
    if (!$feedUrl) {
        throw new Exception('Feed URL is required');
    }
    
    $parser = new RSSParser();
    $feedData = $parser->getFeedData($feedUrl);
    
    echo json_encode($feedData);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'feed_title' => 'Error Loading Feed',
        'items' => []
    ]);
}

?>
