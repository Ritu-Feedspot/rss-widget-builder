"use client"

import { useState } from "react"

export default function CarouselView({ config, feedItems }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % feedItems.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + feedItems.length) % feedItems.length)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const truncateText = (text, maxLength) => {
    if (!text) return ""
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "..."
  }

  const layoutClass = `feed-item feed-view-carousel feed-layout-${config.layoutType}`

  return (
    <div className="feed-content carousel-container">
      <div
        className="carousel-track"
        style={{
          display: "flex",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {feedItems.map((item, index) => (
          <div
            key={index}
            className={layoutClass}
            style={{
              width: "100%",
              flexShrink: 0, 
            }}
          >
            {item.image && (
              <div className="feed-image">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt=""
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
            <div className="feed-text">
              {config.showTitle !== false && item.title && (
                <h4>
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

              {item.description && (
                <p className="feed-description">
                  {truncateText(item.description, 150)}
                </p>
              )}

              {config.showAuthor && (item.author || item.pub_date) && (
                <p className="feed-meta">
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
      <button className="carousel-nav-btn left" onClick={prevSlide}>‹</button>
      <button className="carousel-nav-btn right" onClick={nextSlide}>›</button>
    </div>
  )
}
