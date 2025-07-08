"use client"

import { useState } from "react"

export default function FolderManager({ feed, folders, onAction, onClose }) {
  const [newFolderName, setNewFolderName] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(folders.length === 0)

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onAction("create", newFolderName)
      setNewFolderName("")
    }
  }

  const handleSelectFolder = (folderId) => {
    onAction("existing", null, folderId)
  }

  return (
    <div className="folder-manager-overlay">
      <div className="folder-manager-modal">
        <div className="modal-header">
          <h3>Add "{feed.title}" to Folder</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {folders.length > 0 && !showCreateForm && (
            <div className="existing-folders">
              <h4>Select Existing Folder:</h4>
              <div className="folder-list">
                {folders.map((folder) => (
                  <button key={folder.id} className="folder-option" onClick={() => handleSelectFolder(folder.id)}>
                    📁 {folder.name} ({folder.feed_count} feeds)
                  </button>
                ))}
              </div>
              <button className="btn btn-secondary" onClick={() => setShowCreateForm(true)}>
                Create New Folder
              </button>
            </div>
          )}

          {showCreateForm && (
            <div className="create-folder">
              <h4>Create New Folder:</h4>
              <input
                type="text"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="folder-name-input"
              />
              <div className="folder-actions">
                <button className="btn btn-primary" onClick={handleCreateFolder}>
                  Create Folder
                </button>
                {folders.length > 0 && (
                  <button className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
