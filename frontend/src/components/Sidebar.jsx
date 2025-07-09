"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"
import AuthModal from "./auth/AuthModal"
import { LogIn, LogOut } from "lucide-react"

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, loading, login, logout, isAuthenticated } = useAuth()

  const menuItems = [
    { href: "/", label: "Feedspot Home", icon: "🏠" },
    { href: "/createwidgets", label: "Create Widgets", icon: "➕", requireAuth: true },
    { href: "/mywidgets", label: "My Widgets", icon: "📊", requireAuth: true },
    { href: "/widgetcatalog", label: "Widget Catalog", icon: "📚" },
    { href: "/support", label: "Support", icon: "❓" },
    { href: "/widgetexamples", label: "Widget Examples", icon: "🎨" },
    { href: "/customers", label: "Customers", icon: "👥" },
  ]

  const handleAuthSuccess = (userData) => {
    login(userData)
    setShowAuthModal(false)
  }

  const handleProtectedRoute = (e, requireAuth) => {
    if (requireAuth && !isAuthenticated) {
      e.preventDefault()
      setShowAuthModal(true)
    }
  }

  if (loading) {
    return (
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? "→" : "←"}
          </button>
          <div className="logo">
            <span className="logo-text">{isCollapsed ? "" : "Feedspot"}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-item"
              onClick={(e) => handleProtectedRoute(e, item.requireAuth)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div>
              {!isCollapsed && (
                <div className="user-info">
                  <div className="user-name">{user.full_name || user.username}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              )}
              <button className="nav-item logout-btn" onClick={logout}>
                <span className="nav-icon">
                  <LogOut size={20} /> {/* 👈 Icon component */}
                </span>
                {!isCollapsed && <span className="nav-label">Logout</span>}
              </button>

            </div>
          ) : (
            <button className="nav-item login-btn" onClick={() => setShowAuthModal(true)}>
              <span className="nav-icon">
                  <LogIn size={20} /> {/* 👈 Icon component */}
              </span>
              {!isCollapsed && <span className="nav-label">Login</span>}
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />
    </>
  )
}
