"use client"

import { useState, useEffect } from "react"

export default function WidgetPreview({ config }) {
  const [feedData, setFeedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (config.feedUrl || config.selectedFolder) {
      fetchFeedData()
    }
  }, [config.feedUrl, config.selectedFolder])

  const fetchFeedData = async () => {
    setLoading(true)
    setError(null)

    try {
      let url = ""

      if (config.selectedFolder && config.selectedFolder !== "") {
        url = `http://localhost:8081/rss-widget-builder/backend/api/feeds/getFolderFeeds.php?folderId=${encodeURIComponent(config.selectedFolder)}`
      } else if (config.feedUrl) {
        url = `http://localhost:8081/rss-widget-builder/backend/api/rss/parseRSS.php`
      } else {
        setFeedData(null)
        setLoading(false)
        return
      }

      const response = await fetch(url, {
        method: config.feedUrl && !config.selectedFolder ? "POST" : "GET",
        headers: config.feedUrl && !config.selectedFolder ? { "Content-Type": "application/json" } : {},
        body: config.feedUrl && !config.selectedFolder ? JSON.stringify({ feedUrl: config.feedUrl }) : undefined,
        credentials: "include",
      })

      const text = await response.text()

      let data
      try {
        data = JSON.parse(text)
      } catch (err) {
        console.error("Failed to parse JSON:", text)
        throw new Error("Invalid JSON returned by backend")
      }

      if (data.error) {
        setError(data.error)
        setFeedData(null)
      } else {
        setFeedData(data)
      }
    } catch (err) {
      console.error("Error fetching feed data:", err)
      setError("Failed to load feed data")
      setFeedData(null)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString, format = "long") => {
    if (!dateString) return ""

    const date = new Date(dateString)

    if (format === "short") {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  const truncateText = (text, maxLength) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const getDisplayItems = () => {
    if (!feedData || !feedData.items) return []
    return config.postCount ? feedData.items.slice(0, config.postCount) : feedData.items
  }

  const widgetStyle = {
    width: config.responsive ? "100%" : `${config.width}px`,
    height: `${config.height}px`,
    border: config.showBorder ? `1px solid ${config.borderColor || "#dbdbdb"}` : "none",
    borderRadius: config.cornerStyle === "rounded" ? "8px" : "0",
    fontFamily: config.fontStyle || "Arial, sans-serif",
    backgroundColor: config.contentBgColor || "#ffffff",
    overflow: "hidden", 
    textAlign: config.textAlign || "left",
  }

  const titleStyle = {
    fontSize: `${config.titleSize}px`,
    fontWeight: config.titleBold ? "bold" : "normal",
    color: config.titleColor || "#000000",
    backgroundColor: config.titleBgColor || "#ffffff",
    padding: "10px",
    margin: 0,
    textAlign: config.textAlign || "left",
  }

  // include layoutType and viewType
  const getFeedItemClasses = () => {
    return `feed-item feed-view-${config.viewType} feed-layout-${config.layoutType}`
  }

  // Determine the css container class for feed-content based on view and layout
  const getFeedContentContainerClass = () => {
    if (config.viewType === "grid" && config.layoutType === "grid1") {
      return "grid-layout1-container"
    }
    if (config.viewType === "grid" && config.layoutType === "grid2") {
      return "grid-layout2-container"
    }
    if (config.viewType === "matrixcard" && config.layoutType === "matrixcard1") {
      return "matrixcard-layout1-container"
    }
    if (config.viewType === "matrixcard" && config.layoutType === "matrixcard2") {
      return "matrixcard-layout2-container"
    }
    return ""
  }

  return (
    <div className="widget-preview">
      <h4>Preview</h4>
      <br></br>
      <div style={widgetStyle} className="widget-container">
        {/* Custom Title */}
        {config.customTitle && config.title && (
          <h3 style={titleStyle}>
            {config.titleLink ? (
              <a
                href={config.titleLink}
                target={config.openLinks === "same" ? "_self" : "_blank"}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {config.title}
              </a>
            ) : (
              config.title
            )}
          </h3>
        )}

        {/* Feed Title if not custom not set*/}
        {!config.customTitle && feedData && feedData.feed_title && <h3 style={titleStyle}>{feedData.feed_title}</h3>}

        <div
          className={`feed-content ${getFeedContentContainerClass()}`}
          style={{ overflowY: "auto", height: "calc(100% - 40px)" }}
        >
          {" "}
          {/* Added overflowY and height */}
          {loading && (
            <div className="feed-loading">
              <p>Loading feed data...</p>
            </div>
          )}
          {error && (
            <div className="feed-error">
              <p>Error: {error}</p>
            </div>
          )}
          {!loading && !error && getDisplayItems().length === 0 && (
            <div className="feed-empty">
              <p>No feed data available. Please enter a valid RSS feed URL or select a folder.</p>
            </div>
          )}
          {!loading &&
            !error &&
            getDisplayItems().map((item, index) => (
              <div key={index} className={getFeedItemClasses()}>
                {" "}
                {/* Updated class */}
                {/* Item Image */}
                {item.image && (
                  <div className="feed-image">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt=""
                      onError={(e) => {
                        e.target.style.display = "none"
                      }}
                    />
                  </div>
                )}
                <div className="feed-text">
                  {/* Item Title */}
                  {config.showTitle !== false && item.title && (
                    <h4
                      style={{
                        fontSize: `${config.contentTitleSize || 14}px`,
                        fontWeight: config.boldTitle ? "bold" : "normal",
                        color: config.contentTitleColor || "#000000",
                        margin: "0 0 5px 0",
                        lineHeight: "1.3",
                      }}
                    >
                      {config.showOriginalLink ? (
                        <a
                          href={item.link}
                          target={config.openLinks === "same" ? "_self" : "_blank"}
                          style={{ color: "inherit", textDecoration: "none" }}
                        >
                          {truncateText(item.title, config.maxTitleChars || 55)}
                        </a>
                      ) : (
                        truncateText(item.title, config.maxTitleChars || 55)
                      )}
                    </h4>
                  )}

                  {/* Item Description */}
                  {item.description && (
                    <p
                      className="feed-description"
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        margin: "5px 0",
                        lineHeight: "1.4",
                      }}
                    >
                      {truncateText(item.description, 150)}
                    </p>
                  )}

                  {/* Author and Date */}
                  {config.showAuthor && (item.author || item.pub_date) && (
                    <p
                      className="feed-meta"
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        margin: "5px 0 0 0",
                      }}
                    >
                      {item.author && `By ${item.author}`}
                      {item.author && item.pub_date && " • "}
                      {item.pub_date && formatDate(item.pub_date, config.dateFormat)}
                      {item.feed_source && ` • ${item.feed_source}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
