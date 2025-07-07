-- RSS Widget Builder Database Schema

CREATE DATABASE IF NOT EXISTS rss_widget_builder;
USE rss_widget_builder;

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feeds table
CREATE TABLE feeds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    rss_url VARCHAR(500) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Folders table
CREATE TABLE folders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User followed feeds table
CREATE TABLE user_followed_feeds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    feed_id INT NOT NULL,
    folder_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feed_id) REFERENCES feeds(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
    UNIQUE KEY unique_feed_folder (feed_id, folder_id)
);

-- Widgets table
CREATE TABLE widgets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    feed_url VARCHAR(500),
    selected_folder VARCHAR(100),
    width INT DEFAULT 350,
    height INT DEFAULT 400,
    responsive BOOLEAN DEFAULT TRUE,
    title VARCHAR(255),
    title_size INT DEFAULT 16,
    title_color VARCHAR(7) DEFAULT '#000000',
    title_bold BOOLEAN DEFAULT FALSE,
    show_author BOOLEAN DEFAULT TRUE,
    show_date BOOLEAN DEFAULT TRUE,
    post_count INT DEFAULT 5,
    view_type VARCHAR(20) DEFAULT 'list',
    font_style VARCHAR(50) DEFAULT 'Arial',
    text_align VARCHAR(20) DEFAULT 'left',
    show_border BOOLEAN DEFAULT FALSE,
    border_color VARCHAR(7) DEFAULT '#dbdbdb',
    corner_style VARCHAR(20) DEFAULT 'square',
    custom_title BOOLEAN DEFAULT FALSE,
    title_link VARCHAR(500),
    title_bg_color VARCHAR(7) DEFAULT '#ffffff',
    show_original_link BOOLEAN DEFAULT FALSE,
    content_bg_color VARCHAR(7) DEFAULT '#ffffff',
    date_format VARCHAR(20) DEFAULT 'long',
    show_title BOOLEAN DEFAULT TRUE,
    bold_title BOOLEAN DEFAULT FALSE,
    max_title_chars INT DEFAULT 55,
    content_title_size INT DEFAULT 14,
    content_title_color VARCHAR(7) DEFAULT '#000000',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Feed posts table (for caching RSS content)
CREATE TABLE feed_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    feed_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    link VARCHAR(500),
    pub_date DATETIME,
    author VARCHAR(255),
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feed_id) REFERENCES feeds(id) ON DELETE CASCADE
);

-- FAQs table
CREATE TABLE faqs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Widget examples table
CREATE TABLE widget_examples (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    preview_image VARCHAR(500),
    category VARCHAR(100),
    features JSON,
    template_config JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO categories (name, icon, description) VALUES
('Technology', '💻', 'Latest tech news and updates'),
('Business', '💼', 'Business and finance news'),
('Health', '🏥', 'Health and wellness content'),
('Sports', '⚽', 'Sports news and updates'),
('Entertainment', '🎬', 'Movies, TV, and entertainment'),
('Science', '🔬', 'Scientific discoveries and research'),
('Travel', '✈️', 'Travel guides and destinations'),
('Food', '🍕', 'Recipes and food culture'),
('Fashion', '👗', 'Fashion trends and style'),
('Education', '📚', 'Learning and educational content');

INSERT INTO feeds (title, url, rss_url, description, category_id) VALUES
('TechCrunch', 'https://techcrunch.com', 'https://techcrunch.com/feed/', 'Latest technology news', 1),
('The Verge', 'https://theverge.com', 'https://www.theverge.com/rss/index.xml', 'Technology and culture', 1),
('Wired', 'https://wired.com', 'https://www.wired.com/feed/rss', 'Technology and innovation', 1),
('Forbes Tech', 'https://forbes.com', 'https://www.forbes.com/technology/feed/', 'Business technology news', 2),
('Harvard Business Review', 'https://hbr.org', 'https://feeds.hbr.org/harvardbusiness', 'Business insights', 2);

INSERT INTO faqs (question, answer, sort_order) VALUES
('How do I create my first RSS widget?', 'Go to the Create Widgets page, enter an RSS feed URL or select from your followed feeds, customize the appearance, and click "Save & Get Code" to generate your embed code.', 1),
('Can I customize the appearance of my widget?', 'Yes! You can customize colors, fonts, sizes, borders, layout styles, and many other visual aspects of your widget to match your website design.', 2),
('How do I add the widget to my website?', 'After creating your widget, copy the provided embed code and paste it into your website\'s HTML where you want the widget to appear.', 3),
('How often does the widget update with new content?', 'Widgets automatically update every 15-30 minutes to fetch the latest content from your RSS feeds.', 4),
('Can I follow multiple RSS feeds in one widget?', 'Yes, you can create folders and add multiple feeds to display content from various sources in a single widget.', 5);
