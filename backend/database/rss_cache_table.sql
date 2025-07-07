-- Add RSS cache table to existing schema
USE rss_widget_builder;

CREATE TABLE IF NOT EXISTS rss_cache (
    id INT PRIMARY KEY AUTO_INCREMENT,
    feed_url VARCHAR(500) NOT NULL UNIQUE,
    data LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_feed_url (feed_url),
    INDEX idx_updated_at (updated_at)
);
