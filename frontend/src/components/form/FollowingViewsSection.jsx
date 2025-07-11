"use client"

import { VIEW_TYPES, VIEW_LAYOUTS } from "@/utils/constants" 

export default function FollowingViewsSection({ viewType, layoutType, onChange }) {
  const currentLayouts = VIEW_LAYOUTS[viewType] || []

  const handleViewTypeChange = (newViewType) => {
    // Set the first layout of that type as default
    const defaultLayout = VIEW_LAYOUTS[newViewType]?.[0]?.id || ""
    onChange("viewType", newViewType)
    onChange("layoutType", defaultLayout)
  }

  const handleLayoutChange = (newLayoutType) => {
    onChange("layoutType", newLayoutType)
  }

  return (
    <div className="form-section">
      <h3>Following Views</h3>
      <div className="view-type-buttons">
        {VIEW_TYPES.map((view) => (
          <button
            key={view.type}
            className={`view-btn ${viewType === view.type ? "active" : ""}`}
            onClick={() => handleViewTypeChange(view.type)}
            title={view.label}
          >
            {view.icon && <view.icon size={25} />}
          </button>
        ))}
      </div>

      {currentLayouts.length > 0 && (
        <div className="layout-thumbnails-section">
          <h4>Select Layout:</h4>
          <div className="layout-thumbnails-grid">
            {currentLayouts.map((layout) => (
              <div key={layout.id} className="layout-thumbnail-wrapper">
                <img
                  src={layout.image || "/placeholder.svg"}
                  alt={layout.label}
                  className={`layout-thumbnail ${layoutType === layout.id ? "active" : ""}`}
                  onClick={() => handleLayoutChange(layout.id)}
                />
                <span className="layout-label">{layout.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
