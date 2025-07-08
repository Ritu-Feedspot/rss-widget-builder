"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function MyWidgets() {
  const [widgets, setWidgets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWidgets()
  }, [])

  const fetchWidgets = async () => {
    try {
      const response = await fetch("http://localhost/rss-widget-builder/backend/api/widgets/read.php")
      const data = await response.json()
      setWidgets(data)
    } catch (error) {
      console.error("Error fetching widgets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWidget = async (widgetId) => {
    if (confirm("Are you sure you want to delete this widget?")) {
      try {
        await fetch("http://localhost/rss-widget-builder/backend/api/widgets/delete.php", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: widgetId }),
        })
        fetchWidgets() // Refresh the list
      } catch (error) {
        console.error("Error deleting widget:", error)
      }
    }
  }

  const generateEmbedCode = (widget) => {
    return `<iframe src="${window.location.origin}/embed/${widget.id}" width="${widget.width}" height="${widget.height}" frameborder="0"></iframe>`
  }

  if (loading) {
    return (
      <div className="my-widgets-page">
        <div className="loading">Loading widgets...</div>
      </div>
    )
  }

  return (
    <div className="my-widgets-page">
      <div className="page-header">
        <h1>My Widgets</h1>
        <Link href="/createwidgets" className="btn btn-primary">
          Create New Widget
        </Link>
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
              {widgets.map((widget) => (
                <tr key={widget.id}>
                  <td>
                    <div className="widget-name">{widget.name || `Widget ${widget.id}`}</div>
                  </td>
                  <td>
                    <div className="feed-source">{widget.feed_title || widget.feed_url}</div>
                  </td>
                  <td>
                    <div className="dimensions">
                      {widget.responsive ? "Responsive" : `${widget.width}x${widget.height}`}
                    </div>
                  </td>
                  <td>
                    <div className="created-date">{new Date(widget.created_at).toLocaleDateString()}</div>
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
                      <button className="btn btn-small btn-danger" onClick={() => handleDeleteWidget(widget.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
