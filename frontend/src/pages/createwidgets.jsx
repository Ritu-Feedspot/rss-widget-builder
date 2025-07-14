"use client"

import { useState } from "react"
import FeedSourceSection from "@/components/form/FeedSourceSection"
import GeneralSection from "../components/form/GeneralSection"
import FeedTitleSection from "../components/form/FeedTitleSection"
import FeedContentSection from "../components/form/FeedContentSection"
import FollowingViewsSection from "../components/form/FollowingViewsSection"
import WidgetPreview from "../components/preview/WidgetPreview"
import { WIDGET_DEFAULTS } from "@/utils/constants" // Import defaults

export default function CreateWidgets() {
  const [widgetConfig, setWidgetConfig] = useState({
    ...WIDGET_DEFAULTS, // Use defaults from constants
    feedUrl: "",
    selectedFolder: "",
    customTitle: false,
    titleLink: "",
    titleBgColor: "#ffffff",
    showOriginalLink: false,
    contentBgColor: "#ffffff",
    dateFormat: "long",
    showTitle: true,
    boldTitle: false,
    maxTitleChars: 55,
    contentTitleSize: 14,
    contentTitleColor: "#000000",
    openLinks: "new",
  })

  const [widgetName, setWidgetName] = useState("")

  const updateConfig = (key, value) => {
    setWidgetConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleFeedSelect = (feedUrl) => {
    updateConfig("feedUrl", feedUrl)
    // Clear folder selection when direct feed is selected
    if (feedUrl) {
      updateConfig("selectedFolder", "")
    }
  }

  const handleFolderSelect = (folderId) => {
    updateConfig("selectedFolder", folderId)
    // Clear direct feed URL when folder is selected
    if (folderId) {
      updateConfig("feedUrl", "")
    }
  }

  const handleSaveWidget = async () => {
    if (!widgetConfig.feedUrl && !widgetConfig.selectedFolder) {
      alert("Please select an RSS feed or folder before saving.")
      return
    }

    if (!widgetName.trim()) {
      alert("Please enter a widget name.")
      return
    }
    try {
      const response = await fetch("http://localhost:8081/rss-widget-builder/backend/api/widgets/create.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...widgetConfig,
          name: widgetName,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert("Widget saved successfully!")
        // Optionally redirect to My Widgets page
        // window.location.href = '/mywidgets'
      } else {
        alert("Error saving widget: " + (result.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error saving widget:", error)
      alert("Error saving widget. Please try again.")
    }
  }

  const handleReset = () => {
    setWidgetConfig({
      ...WIDGET_DEFAULTS, // Reset to defaults
      feedUrl: "",
      selectedFolder: "",
      customTitle: false,
      titleLink: "",
      titleBgColor: "#ffffff",
      showOriginalLink: false,
      contentBgColor: "#ffffff",
      dateFormat: "long",
      showTitle: true,
      boldTitle: false,
      maxTitleChars: 55,
      contentTitleSize: 14,
      contentTitleColor: "#000000",
      openLinks: "new",
    })
    setWidgetName("")
  }

  return (
    <div className="create-widgets-page">
      <div className="page-header">
        <h1>Feedspot Widgets</h1>
        <h2>Embed RSS Widget on your Website</h2>

        <div className="widget-info two-column">
          <div className="info-text">
            <p>
              Feedspot Widget is a handy widget which lets you embed and display latest updates from your favourite
              sources (Blogs, News Websites, Podcasts, Youtube Channels, RSS Feeds, etc) on your website.
            </p>
          </div>

          <div className="steps">
            <ol>
              <li>Get started by adding your favourite websites to your account as content source for widget.</li>
              <li>Customize the look and feel of the widget to match your website style.</li>
              <li>Click on "Save and Get Code" button, copy the embed code and paste on your website.</li>
              <li>Widget updates automatically when new content is available.</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="widget-builder">
        <div className="form-column">
          <div className="form-section">
            <FeedSourceSection
              feedUrl={widgetConfig.feedUrl}
              selectedFolder={widgetConfig.selectedFolder}
              onFeedSelect={handleFeedSelect}
              onFolderSelect={handleFolderSelect}
            />

            <FollowingViewsSection
              viewType={widgetConfig.viewType}
              layoutType={widgetConfig.layoutType} // Pass layoutType
              onChange={updateConfig} // Pass updateConfig directly
            />

            <GeneralSection config={widgetConfig} onChange={updateConfig} />

            <FeedTitleSection config={widgetConfig} onChange={updateConfig} />

            <FeedContentSection config={widgetConfig} onChange={updateConfig} />

            <div className="form-actions">
              <button onClick={handleSaveWidget} className="btn btn-primary">
                Save & Get Code
              </button>
              <button onClick={handleReset} className="btn btn-secondary">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="preview-column">
          <div className="preview-section">
            <div className="preview-sticky">
              <input
                type="text"
                placeholder="Enter Widget Name"
                className="widget-name-input"
                value={widgetName}
                onChange={(e) => setWidgetName(e.target.value)}
              />
              <WidgetPreview config={widgetConfig} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
