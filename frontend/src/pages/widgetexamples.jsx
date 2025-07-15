"use client"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import AuthModal from "../components/auth/AuthModal"
import Link from "next/link"

export default function WidgetExamples() {
  const { isAuthenticated, login } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleCreateWidgetClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault() 
      setShowAuthModal(true)
    }
  }
  const handleAuthSuccess = (userData) => {
    login(userData)
    setShowAuthModal(false)
    // Optionally redirect after successful login, e.g., to /createwidgets
    window.location.href = "/createwidgets"
  }
  const examples = [
    {
      id: 1,
      name: "Tech News Widget",
      description: "Display latest technology news in a clean, modern layout",
      preview_image: "/placeholder.svg?height=200&width=300",
      category: "News",
      features: ["Responsive design", "Custom colors", "Show/hide author"],
    },
    {
      id: 2,
      name: "Blog Posts Grid",
      description: "Show blog posts in a grid layout with featured images",
      preview_image: "/placeholder.svg?height=200&width=300",
      category: "Blog",
      features: ["Grid layout", "Featured images", "Date formatting"],
    },
    {
      id: 3,
      name: "Minimal List View",
      description: "Simple list view perfect for sidebars and small spaces",
      preview_image: "/placeholder.svg?height=200&width=300",
      category: "Minimal",
      features: ["Compact design", "Custom fonts", "Border options"],
    },
    {
      id: 4,
      name: "Magazine Style",
      description: "Magazine-style layout with large featured articles",
      preview_image: "/placeholder.svg?height=200&width=300",
      category: "Magazine",
      features: ["Large images", "Rich typography", "Multiple columns"],
    },
  ];

  const handleUseTemplate = (example) => {
    const params = new URLSearchParams({
      template: example.id,
      name: example.name,
    });
    window.location.href = `/createwidgets?${params.toString()}`;
  };

  return (
    <div className="widget-examples-page">
      <div className="page-header">
        <h1>Widget Examples</h1>
        <p>Get inspired by these pre-designed widget templates</p>
      </div>

      <div className="examples-grid">
        {examples.map((example) => (
          <div key={example.id} className="example-card">
            <div className="example-preview">
              <img src={example.preview_image} alt={example.name} />
              {/* <div className="example-overlay">
                <button className="btn btn-primary" onClick={() => handleUseTemplate(example)}>
                  Use This Template
                </button>
              </div> */}
            </div>

            <div className="example-content">
              <div className="example-header">
                <h3>{example.name}</h3>
                <span className="example-category">{example.category}</span>
              </div>

              <p className="example-description">{example.description}</p>

              <div className="example-features">
                <h4>Features:</h4>
                <ul>
                  {example.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="custom-widget-cta">
        <h2>Need a Custom Widget?</h2>
        
        <Link href="/createwidgets" className="btn btn-primary" onClick={handleCreateWidgetClick}>
            Create Your Own Widget
        </Link>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}
