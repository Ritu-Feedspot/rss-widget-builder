"use client"

export default function CategoryButtons({ categories, selectedCategory, onCategorySelect }) {
  return (
    <div className="category-buttons-section">
      <h2>Browse by Category</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory?.id === category.id ? "active" : ""}`}
            onClick={() => onCategorySelect(category)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
            <span className="category-count">{category.feed_count} feeds</span>
          </button>
        ))}
      </div>
    </div>
  )
}
