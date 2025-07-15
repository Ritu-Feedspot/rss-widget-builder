"use client"

import { useState } from "react"

export default function Customers() {
  //  Static customer list
  const staticCustomers = [
    { id: 1, name: "TechCrunch", logo: "/techcrunchlogo.png", website: "techcrunch.com" },
    { id: 2, name: "Mashable", logo: "/mashablelogo.png", website: "mashable.com" },
    { id: 3, name: "The Verge", logo: "/vergelogo.jpeg", website: "theverge.com" },
    { id: 4, name: "Wired", logo: "/wiredlogo.png", website: "wired.com" },
  ]

  const [customers] = useState(staticCustomers)

  // 🔒 Optional: Fetch from backend in future
  /*
  import { useEffect } from "react"

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers/getCustomers.php")
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error fetching customers:", error)
      setCustomers(staticCustomers) // fallback
    }
  }
  */

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1>Our Customers</h1>
        <p>Trusted by leading websites and blogs worldwide</p>
      </div>

      <div className="customers-stats">
        <div className="stat-item">
          <div className="stat-number">10,000+</div>
          <div className="stat-label">Active Widgets</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">5,000+</div>
          <div className="stat-label">Happy Customers</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">1M+</div>
          <div className="stat-label">Monthly Views</div>
        </div>
      </div>

      <div className="customers-grid">
        {customers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <img
              src={customer.logo || "/placeholder.svg?height=80&width=120"}
              alt={customer.name}
              className="customer-logo"
            />
            <div className="customer-info">
              <h3>{customer.name}</h3>
              <p>{customer.website}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <blockquote>
              "Feedspot widgets have transformed how we display content on our website. Easy to use and highly
              customizable."
            </blockquote>
            <cite>- Sarah Johnson, Content Manager</cite>
          </div>
          <div className="testimonial">
            <blockquote>
              "The RSS widget integration was seamless. Our readers love the fresh content updates."
            </blockquote>
            <cite>- Mike Chen, Web Developer</cite>
          </div>
          <div className="testimonial">
            <blockquote>"Great support team and excellent documentation. Highly recommend for any website."</blockquote>
            <cite>- Lisa Rodriguez, Blog Owner</cite>
          </div>
        </div>
      </div>

      {/* <div className="join-cta">
        <h2>Join Thousands of Satisfied Customers</h2>
        <p>Start creating beautiful RSS widgets for your website today</p>
        <a href="/createwidgets" className="btn btn-primary btn-large">
          Get Started Free
        </a>
      </div> */}
    </div>
  )
}
