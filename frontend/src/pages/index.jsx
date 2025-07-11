"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import AuthModal from "../components/auth/AuthModal"
import Link from "next/link"

export default function Home() {
  const { isAuthenticated, login } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleCreateWidgetClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault() 
      setShowAuthModal(true)
    }
  }

  const handleAuthSuccess = (userData) => {
    login(userData)
    setShowAuthModal(false)
    // Optionally redirect after successful login, e.g., to /createwidgets
    window.location.href = "/createwidgets"
  }

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Welcome to Feedspot Widgets</h1>
        <p>Create and embed RSS widgets on your website</p>

        <div className="quick-actions">
          <Link href="/createwidgets" className="btn btn-primary" onClick={handleCreateWidgetClick}>
            Create Your First Widget
          </Link>
          <Link href="/widgetcatalog" className="btn btn-secondary">
            Browse Feed Catalog
          </Link>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>Easy Widget Creation</h3>
          <p>Build customizable RSS widgets with live preview</p>
        </div>
        <div className="feature-card">
          <h3>Feed Management</h3>
          <p>Organize your feeds into folders and categories</p>
        </div>
        <div className="feature-card">
          <h3>Embed Anywhere</h3>
          <p>Get embed code and paste on any website</p>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />
    </div>
  )
}
