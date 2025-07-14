"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../contexts/AuthContext" // ✅ make sure this exists

export default function MyWidgets() {
  const { user, loading: authLoading } = useAuth()
  const [widgets, setWidgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && user) {
      fetchWidgets()
    }
  }, [authLoading, user])

  const fetchWidgets = async () => {
    try {
      const response = await fetch("http://localhost:8081/rss-widget-builder/backend/api/widgets/read.php", {
        credentials: "include", // ✅ Include session cookies
      })

      if (response.status === 401) {
        setError("You must be logged in to view your widgets.")
        setWidgets([])
        return
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.widgets)) {
        setWidgets(data.widgets)
      } else {
        setError("Failed to load widgets.")
        setWidgets([])
      }
    } catch (err) {
      console.error("Error fetching widgets:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWidget = async (widgetId) => {
    if (confirm("Are you sure you want to delete this widget?")) {
      try {
        await fetch("http://localhost:8081/rss-widget-builder/backend/api/widgets/delete.php", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: widgetId }),
        })
        fetchWidgets() // Refresh after delete
      } catch (error) {
        console.error("Error deleting widget:", error)
      }
    }
  }

  const generateEmbedCode = (widget) => {
    if (typeof window === "undefined") return ""
    const general = widget.general_settings || {}
    const width = general.width || 350
    const height = general.height || 400
    return `<iframe src="${window.location.origin}/embed/${widget.id}" width="${width}" height="${height}" frameborder="0"></iframe>`
  }

  if (authLoading || loading) {
    return <div className="my-widgets-page"><div className="loading">Loading...</div></div>
  }

  if (!user) {
    return (
      <div className="my-widgets-page">
        <div className="unauthenticated-message">
          <h2>Please log in to view your widgets</h2>
          <Link href="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="my-widgets-page"><p className="error-message">{error}</p></div>
  }

  return (
    <div className="my-widgets-page">
      <div className="page-header">
        <h1>My Widgets</h1>
        {/* <Link href="/createwidgets" className="btn btn-primary">
          Create New Widget
        </Link> */}
      </div>

      {widgets.length === 0 ? (
        <div className="empty-state">
          <h2>No widgets created yet</h2>
          <p>Create your first RSS widget to get started</p>
          <Link href="/createwidgets" className="btn btn-primary">
            Create Widget
          </Link>
        </div>
      ) : (
        <div className="widgets-table-container">
          <table className="widgets-table">
            <thead>
              <tr>
                <th>Widget Name</th>
                <th>Feed Source</th>
                <th>Dimensions</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {widgets.map((widget) => {
                const general = widget.general_settings || {}
                const width = general.width || 350
                const height = general.height || 400
                const responsive = general.responsive

                return (
                  <tr key={widget.id}>
                    <td>
                      <div className="widget-name">{widget.name || `Widget ${widget.id}`}</div>
                    </td>
                    <td>
                      <div className="feed-source" style={{ wordWrap: "break-word", maxWidth: "200px" }}>
                        {widget.feed_url ? (
                          <a href={widget.feed_url} target="_blank" rel="noopener noreferrer">
                            {widget.feed_url}
                          </a>
                        ) : "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="dimensions">
                        {responsive ? "Responsive" : `${width}x${height}`}
                      </div>
                    </td>
                    <td>
                      <div className="created-date">
                        {new Date(widget.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="widget-actions">
                        <Link href={`/createwidgets?edit=${widget.id}`} className="btn btn-small btn-secondary">
                          Edit
                        </Link>
                        <button
                          className="btn btn-small btn-primary"
                          onClick={() => {
                            const code = generateEmbedCode(widget)
                            navigator.clipboard.writeText(code)
                            alert("Embed code copied to clipboard!")
                          }}
                        >
                          Get Code
                        </button>
                        <button
                          className="btn btn-small btn-primary"
                          onClick={() => handleDeleteWidget(widget.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
