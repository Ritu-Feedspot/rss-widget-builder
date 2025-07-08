"use client"

import { useState, useEffect } from "react"

export default function FolderFeedDropdown({ selected, onSelect }) {
  const [folders, setFolders] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchUserFolders()
  }, [])

  const fetchUserFolders = async () => {
    try {
      const response = await fetch("http://localhost/rss-widget-builder/backend/api/feeds/getUserFolders.php")
      const data = await response.json()
      setFolders(data)
    } catch (error) {
      console.error("Error fetching folders:", error)
    }
  }

  const getSelectedFolderName = () => {
    if (!selected) return "Select a folder"
    const folder = folders.find((f) => f.id.toString() === selected.toString())
    return folder ? folder.name : "Select a folder"
  }

  return (
    <div className="folder-dropdown">
      <button className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        {getSelectedFolderName()} ▼
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div
            className="dropdown-item"
            onClick={() => {
              onSelect("")
              setIsOpen(false)
            }}
          >
            <em>None selected</em>
          </div>
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="dropdown-item"
              onClick={() => {
                onSelect(folder.id.toString())
                setIsOpen(false)
              }}
            >
              📁 {folder.name} ({folder.feed_count} feeds)
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
