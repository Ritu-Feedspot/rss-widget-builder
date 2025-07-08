export default function Home() {
  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Welcome to Feedspot Widgets</h1>
        <p>Create and embed RSS widgets on your website</p>

        <div className="quick-actions">
          <a href="/createwidgets" className="btn btn-primary">
            Create Your First Widget
          </a>
          <a href="/widgetcatalog" className="btn btn-secondary">
            Browse Feed Catalog
          </a>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>Easy Widget Creation</h3>
          <p>Build customizable RSS widgets with live preview</p>
        </div>
        <div className="feature-card">
          <h3>Feed Management</h3>
          <p>Organize your feeds into folders and categories</p>
        </div>
        <div className="feature-card">
          <h3>Embed Anywhere</h3>
          <p>Get embed code and paste on any website</p>
        </div>
      </div>
    </div>
  );
}
