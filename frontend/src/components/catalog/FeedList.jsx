"use client"

export default function FeedList({ feeds, category, onFollowFeed, followedFeeds }) {
  const isFollowed = (feedId) => {
    return followedFeeds.some((feed) => feed.id === feedId)
  }

  return (
    <div className="feed-list-section">
      <h2>{category.name} Feeds</h2>
      <div className="feeds-grid">
        {feeds.map((feed) => (
          <div key={feed.id} className="feed-card">
            <div className="feed-image">
              <img src={feed.image || "/placeholder.svg?height=100&width=100"} alt={feed.title} />
            </div>
            <div className="feed-content">
              <h3>{feed.title}</h3>
              <p className="feed-description">{feed.description}</p>
              <div className="feed-meta">
                <span className="feed-url">{feed.url}</span>
                <span className="feed-posts">{feed.post_count} posts</span>
              </div>
              <div className="feed-actions">
                {isFollowed(feed.id) ? (
                  <button className="btn btn-following" disabled>
                    ✓ Following
                  </button>
                ) : (
                  <button className="btn btn-follow" onClick={() => onFollowFeed(feed)}>
                    Follow and Add to Folder
                  </button>
                )}
                {/* <button className="btn btn-secondary">Add to Folder</button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
