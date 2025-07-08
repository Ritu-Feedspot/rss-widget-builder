"use client"

export default function FollowingViewsSection({ viewType, onChange }) {
  const viewTypes = [
    { type: "list", icon: "☰", label: "List" },
    { type: "compact", icon: "≡", label: "Compact" },
    { type: "card", icon: "▦", label: "Card" },
    { type: "grid", icon: "⊞", label: "Grid" },
    { type: "magazine", icon: "▤", label: "Magazine" },
  ]

  return (
    <div className="form-section">
      <h3>Following Views</h3>
      <div className="view-type-buttons">
        {viewTypes.map((view) => (
          <button
            key={view.type}
            className={`view-btn ${viewType === view.type ? "active" : ""}`}
            onClick={() => onChange(view.type)}
            title={view.label}
          >
            {view.icon}
          </button>
        ))}
      </div>
    </div>
  )
}
