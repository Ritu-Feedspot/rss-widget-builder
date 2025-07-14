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
    const response = await fetch("http://localhost:8081/rss-widget-builder/backend/api/feeds/getUserFolders.php", {
      credentials: "include",
    });
    const data = await response.json();
    console.log("Fetched folders:", data);

    if (Array.isArray(data)) {
      setFolders(data);
    } else {
      console.error("Expected array, got:", data);
      setFolders([]);
    }
  } catch (error) {
    console.error("Error fetching folders:", error);
    setFolders([]);
  }
};

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
          {Array.isArray(folders) && folders.map((folder) => (
            <div key={folder.id} className="dropdown-item"
              onClick={() => {
                onSelect(folder.id.toString())
                setIsOpen(false)
              }}> 📁 {folder.name} ({folder.feed_count} feeds)
          </div>
  ))}
        </div>
      )}
    </div>
  )
}
