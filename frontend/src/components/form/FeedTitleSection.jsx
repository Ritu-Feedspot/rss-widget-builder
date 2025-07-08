"use client"

export default function FeedTitleSection({ config, onChange }) {
  return (
    <div className="form-section">
      <h3>Feed Title</h3>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.customTitle || false}
            onChange={(e) => onChange("customTitle", e.target.checked)}
          />
          Custom
        </label>
      </div>

      {config.customTitle && (
        <>
          <div className="form-group">
            <label>Main Title</label>
            <input
              type="text"
              placeholder="Example..."
              value={config.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Main title link</label>
            <input
              type="text"
              placeholder="Example..."
              value={config.titleLink || ""}
              onChange={(e) => onChange("titleLink", e.target.value)}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label>Font-size</label>
        <div className="number-input">
          <button onClick={() => onChange("titleSize", Math.max(10, config.titleSize - 1))}>-</button>
          <span>{config.titleSize}</span>
          <button onClick={() => onChange("titleSize", config.titleSize + 1)}>+</button>
        </div>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.titleBold || false}
            onChange={(e) => onChange("titleBold", e.target.checked)}
          />
          Bold
        </label>
      </div>

      <div className="form-group">
        <label>Colors</label>
        <div className="color-inputs">
          <div>
            <label>Background color</label>
            <input
              type="color"
              value={config.titleBgColor || "#ffffff"}
              onChange={(e) => onChange("titleBgColor", e.target.value)}
            />
          </div>
          <div>
            <label>Font color</label>
            <input
              type="color"
              value={config.titleColor || "#acadae"}
              onChange={(e) => onChange("titleColor", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
