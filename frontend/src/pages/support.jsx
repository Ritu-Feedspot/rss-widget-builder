"use client"

import { useState, useEffect } from "react"

export default function Support() {
  const [faqs, setFaqs] = useState([])
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch("http://localhost:8081/rss-widget-builder/backend/api/support/getFAQs.php")
      const data = await response.json()
      setFaqs(data)
    } catch (error) {
      console.error("Error fetching FAQs:", error)
    }
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="support-page">
      <div className="page-header">
        <h1>Support & FAQ</h1>
        <p>Find answers to common questions about RSS widgets</p>
      </div>

      <div className="support-content">
        <div className="contact-info">
          <h2>Need Help?</h2><br/>
          <p>If you can't find the answer you're looking for, feel free to contact us:</p>
          <div className="contact-methods">
            <div className="contact-method">
              <strong>Email:</strong> support@feedspot.com
            </div>
            <div className="contact-method">
              <strong>Response Time:</strong> Within 24 hours
            </div>
          </div>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="faq-item">
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  <span className="faq-toggle">{openFaq === index ? "−" : "+"}</span>
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="quick-start">
          <h2>Quick Start Guide</h2>
          <div className="steps-guide">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Browse Feed Catalog</h3>
                <p>Visit the Widget Catalog to find RSS feeds by category</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Follow Feeds</h3>
                <p>Click "Follow" on feeds you want to include in your widgets</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Create Widget</h3>
                <p>Use the Create Widgets page to customize your RSS widget</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Embed on Website</h3>
                <p>Copy the embed code and paste it on your website</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
