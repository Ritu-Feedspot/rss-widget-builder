<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once '../../db/connect.php';

try {
    $db = new Database();
    
    $sql = "SELECT * FROM faqs ORDER BY sort_order, id";
    $faqs = $db->fetchAll($sql);
    
    echo json_encode($faqs);
    
} catch (Exception $e) {
    // Fallback to static FAQs if database fails
    $staticFaqs = [
        [
            'id' => 1,
            'question' => 'How do I create my first RSS widget?',
            'answer' => 'Go to the Create Widgets page, enter an RSS feed URL or select from your followed feeds, customize the appearance, and click "Save & Get Code" to generate your embed code.'
        ],
        [
            'id' => 2,
            'question' => 'Can I customize the appearance of my widget?',
            'answer' => 'Yes! You can customize colors, fonts, sizes, borders, layout styles, and many other visual aspects of your widget to match your website design.'
        ],
        [
            'id' => 3,
            'question' => 'How do I add the widget to my website?',
            'answer' => 'After creating your widget, copy the provided embed code and paste it into your website\'s HTML where you want the widget to appear.'
        ],
        [
            'id' => 4,
            'question' => 'How often does the widget update with new content?',
            'answer' => 'Widgets automatically update every 15-30 minutes to fetch the latest content from your RSS feeds.'
        ],
        [
            'id' => 5,
            'question' => 'Can I follow multiple RSS feeds in one widget?',
            'answer' => 'Yes, you can create folders and add multiple feeds to display content from various sources in a single widget.'
        ]
    ];
    
    echo json_encode($staticFaqs);
}
?>
