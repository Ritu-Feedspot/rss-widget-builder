"use client"

export default function GeneralSection({ config, onChange }) {
  return (
    <div className="form-section">
      <h3>General</h3>

      <div className="form-group">
        <label>Width</label>
        <div className="width-options">
          <label>
            <input
              type="radio"
              name="widthType"
              checked={!config.responsive}
              onChange={() => onChange("responsive", false)}
            />
            In Pixels
          </label>
          <label>
            <input
              type="radio"
              name="widthType"
              checked={config.responsive}
              onChange={() => onChange("responsive", true)}
            />
            Responsive (Mobile friendly)
          </label>
        </div>

        {!config.responsive && (
          <div className="number-input">
            <button onClick={() => onChange("width", Math.max(200, config.width - 10))}>-</button>
            <span>{config.width}</span>
            <button onClick={() => onChange("width", config.width + 10)}>+</button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Height</label>
        <div className="number-input">
          <button onClick={() => onChange("height", Math.max(200, config.height - 10))}>-</button>
          <span>{config.height}</span>
          <button onClick={() => onChange("height", config.height + 10)}>+</button>
        </div>
      </div>

      <div className="form-group">
        <label>Open links</label>
        <select value={config.openLinks || "new"} onChange={(e) => onChange("openLinks", e.target.value)}>
          <option value="new">New window</option>
          <option value="same">Same window</option>
        </select>
      </div>

      <div className="form-group">
        <label>Font Style</label>
        <select value={config.fontStyle || "Arial"} onChange={(e) => onChange("fontStyle", e.target.value)}>
          <option value="Arial">Arial, Helvetica, sans-serif</option>
          <option value="Georgia">Georgia, serif</option>
          <option value="Times">Times New Roman, serif</option>
        </select>
      </div>

      <div className="form-group">
        <label>Text alignment</label>
        <div className="alignment-buttons">
          {["left", "center", "right", "justify"].map((align) => (
            <button
              key={align}
              className={`align-btn ${config.textAlign === align ? "active" : ""}`}
              onClick={() => onChange("textAlign", align)}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.showBorder || false}
            onChange={(e) => onChange("showBorder", e.target.checked)}
          />
          Border
        </label>

        {config.showBorder && (
          <>
            <input
              type="color"
              value={config.borderColor || "#dbdbdb"}
              onChange={(e) => onChange("borderColor", e.target.value)}
            />
            <div className="corner-options">
              <button
                className={config.cornerStyle === "square" ? "active" : ""}
                onClick={() => onChange("cornerStyle", "square")}
              >
                Square
              </button>
              <button
                className={config.cornerStyle === "rounded" ? "active" : ""}
                onClick={() => onChange("cornerStyle", "rounded")}
              >
                Rounded
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
