"use client"

import { useState } from "react"

export default function FollowingSection({ followedFeeds, userFolders, onRefresh }) {
  const [selectedFolder, setSelectedFolder] = useState(null)

  const getFeedsByFolder = (folderId) => {
    return followedFeeds.filter((feed) => feed.folder_id === folderId)
  }

  const handleUnfollow = async (feedId) => {
    try {
      await fetch("/api/feeds/unfollowFeed.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedId }),
      })
      onRefresh()
    } catch (error) {
      console.error("Error unfollowing feed:", error)
    }
  }

  return (
    <div className="following-section">
      <h2>Following</h2>
      <div className="folders-list">
        {userFolders.map((folder) => (
          <div key={folder.id} className="folder-item">
            <div
              className="folder-header"
              onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
            >
              <span className="folder-icon">📁</span>
              <span className="folder-name">{folder.name}</span>
              <span className="folder-count">({folder.feed_count} feeds)</span>
              <span className="folder-toggle">{selectedFolder === folder.id ? "▼" : "▶"}</span>
            </div>

            {selectedFolder === folder.id && (
              <div className="folder-feeds">
                {getFeedsByFolder(folder.id).map((feed) => (
                  <div key={feed.id} className="followed-feed">
                    <img src={feed.image || "/placeholder.svg?height=40&width=40"} alt="" />
                    <div className="feed-info">
                      <h4>{feed.title}</h4>
                      <p>{feed.url}</p>
                    </div>
                    <button className="unfollow-btn" onClick={() => handleUnfollow(feed.id)}>
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
