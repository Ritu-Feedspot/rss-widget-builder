"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get API base URL from environment or use default
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/rss-widget-builder/backend/api"

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log("Checking auth status at:", `http://localhost:8081/rss-widget-builder/backend/api/auth/me.php`)

      const response = await fetch(`http://localhost:8081/rss-widget-builder/backend/api/auth/me.php`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Auth response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("Auth result:", result)

        if (result.success) {
          setUser(result.user)
        } else {
          setUser(null)
        }
      } else {
        console.log("Auth response not ok:", response.status, response.statusText)
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      console.log("API_BASE_URL:", API_BASE_URL)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = (userData) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      await fetch(`http://localhost:8081/rss-widget-builder/backend/api/auth/logout.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      window.location.href = "/"
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
