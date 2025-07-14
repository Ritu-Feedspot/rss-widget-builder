"use client"

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="auth-form">
            <button className="modal-close" onClick={onCancel}>
          ×
        </button>
        
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn btn-secondary" onClick={onConfirm}>Yes, Logout</button>

          <button className="btn btn-primary" onClick={onCancel}>Cancel</button>
        </div>
        </div>
      </div>
    </div>
  )
}
