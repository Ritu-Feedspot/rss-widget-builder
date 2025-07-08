"use client"

import { useState } from "react"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login") // 'login' or 'register'
  const [successMessage, setSuccessMessage] = useState("")

  if (!isOpen) return null

  const handleLoginSuccess = (user) => {
    onAuthSuccess(user)
    onClose()
  }

  const handleRegisterSuccess = (message) => {
    setSuccessMessage(message)
    setMode("login")
  }

  const handleClose = () => {
    setMode("login")
    setSuccessMessage("")
    onClose()
  }

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="modal-close" onClick={handleClose}>
          ×
        </button>

        {successMessage && <div className="success-message">{successMessage}</div>}

        {mode === "login" ? (
          <LoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={() => setMode("register")} />
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    </div>
  )
}
