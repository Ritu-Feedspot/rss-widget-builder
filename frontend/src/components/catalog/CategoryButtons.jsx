"use client"

export default function CategoryButtons({ categories, selectedCategory, onCategorySelect }) {
  return (
    <div className="category-buttons-section">
  <h2>Browse by Category</h2>
  <div className="category-grid">
    {categories.map((category) => (
      <div key={category.id} className="category-tile">
        <button
          className={`category-btn ${selectedCategory?.id === category.id ? "active" : ""}`}
          onClick={() => onCategorySelect(category)}
        >
          <img
            src={category.image_url || "/images/categories/placeholder.png"}
            alt={category.name}
            className="category-image"
          />
        </button>
        <div className="category-labels">
          <div className="category-name">{category.name}</div>
          <div className="category-count">{category.feed_count} feeds</div>
        </div>
      </div>
    ))}
  </div>
</div>

  )
}
