"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import CategoryButtons from "../components/catalog/CategoryButtons"
import FeedList from "../components/catalog/FeedList"
import FollowingSection from "../components/catalog/FollowingSection"
import FolderManager from "../components/catalog/FolderManager"
import AuthModal from "../components/auth/AuthModal"

export default function WidgetCatalog() {
  const { user, login, loading: authLoading } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [feeds, setFeeds] = useState([])
  const [followedFeeds, setFollowedFeeds] = useState([])
  const [userFolders, setUserFolders] = useState([])
  const [showFolderManager, setShowFolderManager] = useState(false)
  const [selectedFeed, setSelectedFeed] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (user && !authLoading) {
      fetchFollowedFeeds()
      fetchUserFolders()
    }
  }, [user, authLoading])

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
      const response = await fetch(
        `http://localhost/rss-widget-builder/backend/api/catalog/getFeedsByCategory.php?category=${categoryId}`
      )
      const data = await response.json()
      setFeeds(data)
    } catch (error) {
      console.error("Error fetching feeds:", error)
    }
  }

  const fetchFollowedFeeds = async () => {
    try {
      const response = await fetch("http://localhost/rss-widget-builder/backend/api/feeds/getFollowedFeeds.php", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      setFollowedFeeds(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching followed feeds:", error)
      setFollowedFeeds([])
    }
  }

  const fetchUserFolders = async () => {
    try {
      const response = await fetch("http://localhost/rss-widget-builder/backend/api/feeds/getUserFolders.php", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      setUserFolders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching folders:", error)
    }
  }

  const handleCategorySelect = (category) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setSelectedCategory(category)
    fetchFeedsByCategory(category.id)
  }

  const handleFollowFeed = (feed) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setSelectedFeed(feed)
    setShowFolderManager(true)
  }

  const handleFolderAction = async (action, folderName = null, folderId = null) => {
    try {
      if (action === "create") {
        const response = await fetch(`http://localhost/rss-widget-builder/backend/api/folders/createFolder.php`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: folderName }),
        })
        const newFolder = await response.json()
        await followFeedToFolder(selectedFeed.id, newFolder.id)
      } else if (action === "existing") {
        await followFeedToFolder(selectedFeed.id, folderId)
      }

      setShowFolderManager(false)
      setSelectedFeed(null)
      fetchFollowedFeeds()
      fetchUserFolders()
    } catch (error) {
      console.error("Error managing folder:", error)
    }
  }

  const followFeedToFolder = async (feedId, folderId) => {
    const response = await fetch(`http://localhost/rss-widget-builder/backend/api/feeds/followFeed.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedId, folderId }),
    })
    return response.json()
  }

  return (
    <div className="widget-catalog-page">
      <div className="page-header">
        <h1>Widget Catalog</h1>
        <p>Browse and follow RSS feeds by category</p>
      </div>

      <CategoryButtons
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      

      {selectedCategory && (
        <FeedList
          feeds={feeds}
          category={selectedCategory}
          onFollowFeed={handleFollowFeed}
          followedFeeds={followedFeeds}
        />
      )}

      {followedFeeds.length > 0 && (
        <><br/>
        <FollowingSection followedFeeds={followedFeeds} userFolders={userFolders} onRefresh={fetchFollowedFeeds} />
        </>
      )}

      {showFolderManager && (
        <FolderManager
          feed={selectedFeed}
          folders={userFolders}
          onAction={handleFolderAction}
          onClose={() => setShowFolderManager(false)}
        />
      )}


      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          login(user) // ✅ use the login method from context
          setShowAuthModal(false)
        }}
      />

    </div>
  )
}
