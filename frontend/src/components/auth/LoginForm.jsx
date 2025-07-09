"use client"

import { useState } from "react"

export default function LoginForm({ onSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Get API base URL from environment or use default
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/rss-widget-builder/backend/api"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log("Login result:", result)

      if (!response.ok || !result.success) {
        setError(result.error || "Incorrect credentials. User not found.")
        console.error("Login failed:", result.error) // still log error
        return
      }

      // Success
      onSuccess(result.user)

    } catch (err) {
      console.error("Login error:", err)
      setError(`Network error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="auth-form">
      <h2>Login to Feedspot</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username or Email</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="auth-switch">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitchToRegister} className="link-button">
          Register here
        </button>
      </p>

      {/* <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>Debug Info:</p>
        <p>API URL: {API_BASE_URL}</p>
        <p>Login URL: {API_BASE_URL}/auth/login.php</p>
      </div> */}
    </div>
  )
}
