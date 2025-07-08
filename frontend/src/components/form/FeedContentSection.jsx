"use client"

export default function FeedContentSection({ config, onChange }) {
  return (
    <div className="form-section">
      <h3>Feed Content</h3>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.showOriginalLink || false}
            onChange={(e) => onChange("showOriginalLink", e.target.checked)}
          />
          Display link to original content
        </label>
      </div>

      <div className="form-group">
        <label>Background</label>
        <input
          type="color"
          value={config.contentBgColor || "#ffffff"}
          onChange={(e) => onChange("contentBgColor", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.showAuthor || true}
            onChange={(e) => onChange("showAuthor", e.target.checked)}
          />
          Show Author & Date
        </label>
      </div>

      <div className="form-group">
        <label>Date Format</label>
        <div className="date-format-buttons">
          <button
            className={config.dateFormat === "long" ? "active" : ""}
            onClick={() => onChange("dateFormat", "long")}
          >
            Month DD, YYYY
          </button>
          <button
            className={config.dateFormat === "short" ? "active" : ""}
            onClick={() => onChange("dateFormat", "short")}
          >
            DD-MM-YYYY
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.showTitle !== false}
            onChange={(e) => onChange("showTitle", e.target.checked)}
          />
          Show Title
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.boldTitle || false}
            onChange={(e) => onChange("boldTitle", e.target.checked)}
          />
          Bold Title
        </label>
      </div>

      <div className="form-group">
        <label>Max characters title</label>
        <div className="number-input">
          <button onClick={() => onChange("maxTitleChars", Math.max(10, (config.maxTitleChars || 55) - 5))}>-</button>
          <span>{config.maxTitleChars || 55}</span>
          <button onClick={() => onChange("maxTitleChars", (config.maxTitleChars || 55) + 5)}>+</button>
        </div>
      </div>

      <div className="form-group">
        <label>Size of Title</label>
        <div className="number-input">
          <button onClick={() => onChange("contentTitleSize", Math.max(10, (config.contentTitleSize || 14) - 1))}>
            -
          </button>
          <span>{config.contentTitleSize || 14}</span>
          <button onClick={() => onChange("contentTitleSize", (config.contentTitleSize || 14) + 1)}>+</button>
        </div>
      </div>

      <div className="form-group">
        <label>Color: title font</label>
        <input
          type="color"
          value={config.contentTitleColor || "#ffffff"}
          onChange={(e) => onChange("contentTitleColor", e.target.value)}
        />
      </div>
    </div>
  )
}
