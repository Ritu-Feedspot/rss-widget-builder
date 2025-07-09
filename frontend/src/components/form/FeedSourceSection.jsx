"use client"

import CategorySearchBar from "./CategorySearchBar"
import FolderFeedDropdown from "./FolderFeedDropdown"

export default function FeedSourceSection({
  feedUrl,
  selectedFolder,
  onFeedSelect,
  onFolderSelect,
}) {
  return (
    <div className="form-section">
      <h3>RSS Feed Source Url</h3>

      <CategorySearchBar onSelect={onFeedSelect} />

      <div className="rss-feed-section">
        <label className="form-label">RSS Feed URL</label><br></br><br></br>
        <input
          type="text"
          className="feed-source"
          placeholder="Enter Feed URL (e.g., https://techcrunch.com/feed/)"
          value={feedUrl}
          onChange={(e) => onFeedSelect(e.target.value)}
        ></input><br></br><br></br>
        <p className="form-hint">OR Select your Feedspot folder feed</p>
        <br></br>
        <FolderFeedDropdown selected={selectedFolder} onSelect={onFolderSelect} />
      </div>
    </div>
  )
}
