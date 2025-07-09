"use client"

import { useState, useEffect } from "react"

export default function CategorySearchBar({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState([])
  const [feeds, setFeeds] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      filterResults()
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }, [searchTerm, categories, feeds])

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost/rss-widget-builder/backend/api/catalog/getCategories.php")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchFeedsByCategory = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost/rss-widget-builder/backend/api/catalog/getFeedsByCategory.php?category=${categoryId}`)
      const data = await response.json()
      setFeeds(data)
    } catch (error) {
      console.error("Error fetching feeds:", error)
    }
  }

  const filterResults = () => {
    const searchLower = searchTerm.toLowerCase()
    const results = []

    // Filter categories
    categories.forEach((category) => {
      if (category.name.toLowerCase().includes(searchLower)) {
        results.push({
          type: "category",
          id: category.id,
          name: category.name,
          description: `${category.feed_count} feeds available`,
          icon: category.icon,
        })
      }
    })

    // Filter feeds
    feeds.forEach((feed) => {
      if (feed.title.toLowerCase().includes(searchLower) || feed.description?.toLowerCase().includes(searchLower)) {
        results.push({
          type: "feed",
          id: feed.id,
          name: feed.title,
          description: feed.description,
          rss_url: feed.rss_url,
          image: feed.image,
        })
      }
    })

    setFilteredResults(results.slice(0, 10)) // Limit results
  }

  const handleSelect = async (result) => {
    if (result.type === "category") {
      setSelectedCategory(result)
      setSearchTerm(result.name)
      await fetchFeedsByCategory(result.id)
      setShowDropdown(false)

      // Don't select a feed URL yet, let user choose specific feed
      onSelect("")
    } else if (result.type === "feed") {
      setSearchTerm(result.name)
      setShowDropdown(false)
      onSelect(result.rss_url)
    }
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    if (e.target.value === "") {
      setSelectedCategory(null)
      setFeeds([])
    }
  }

  return (
    <div className="category-search">
      <input
        type="text"
        placeholder="Search for categories or feeds (e.g., Technology, TechCrunch, etc.)"
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />

      {showDropdown && (
        <div className="search-dropdown">
          {filteredResults.length === 0 ? (
            <div className="dropdown-item no-results">
              No results found. Try searching for categories like "Technology" or "Business"
            </div>
          ) : (
            filteredResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className={`dropdown-item ${result.type}`}
                onClick={() => handleSelect(result)}
              >
                <div className="result-content">
                  {result.type === "category" && (
                    <>
                      <span className="result-icon">{result.icon}</span>
                      <div className="result-text">
                        <strong>{result.name}</strong>
                        <small>{result.description}</small>
                      </div>
                      <span className="result-type">Category</span>
                    </>
                  )}
                  {result.type === "feed" && (
                    <>
                      {result.image && <img src={result.image || "/placeholder.svg"} alt="" className="result-image" />}
                      <div className="result-text">
                        <strong>{result.name}</strong>
                        <small>{result.description}</small>
                      </div>
                      <span className="result-type">RSS Feed</span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Show feeds from selected category */}
      {selectedCategory && feeds.length > 0 && !showDropdown && (
        <div className="category-feeds">
          <h4>Feeds in {selectedCategory.name}:</h4>
          <div className="feeds-list">
            {feeds.slice(0, 5).map((feed) => (
              <div
                key={feed.id}
                className="feed-option"
                onClick={() => {
                  setSearchTerm(feed.title)
                  onSelect(feed.rss_url)
                }}
              >
                {feed.image && <img src={feed.image || "/placeholder.svg"} alt="" />}
                <div>
                  <strong>{feed.title}</strong>
                  <small>{feed.description}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
