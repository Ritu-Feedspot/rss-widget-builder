const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "ttp://localhost/rss-widget-builder/backend/api"

export const api = {
  // Widget operations
  createWidget: async (widgetData) => {
    const response = await fetch(`${API_BASE_URL}/widgets/create.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(widgetData),
    })
    return response.json()
  },

  getWidgets: async () => {
    const response = await fetch(`${API_BASE_URL}/widgets/read.php`)
    return response.json()
  },

  updateWidget: async (id, widgetData) => {
    const response = await fetch(`${API_BASE_URL}/widgets/update.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...widgetData }),
    })
    return response.json()
  },

  deleteWidget: async (id) => {
    const response = await fetch(`${API_BASE_URL}/widgets/delete.php`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
    return response.json()
  },

  // Feed operations
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/catalog/getCategories.php`)
    return response.json()
  },

  getFeedsByCategory: async (categoryId) => {
    const response = await fetch(`${API_BASE_URL}/catalog/getFeedsByCategory.php?category=${categoryId}`)
    return response.json()
  },

  followFeed: async (feedId, folderId) => {
    const response = await fetch(`${API_BASE_URL}/feeds/followFeed.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedId, folderId }),
    })
    return response.json()
  },

  getUserFolders: async () => {
    const response = await fetch(`${API_BASE_URL}/feeds/getUserFolders.php`)
    return response.json()
  },

  createFolder: async (folderName) => {
    const response = await fetch(`${API_BASE_URL}/folders/createFolder.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: folderName }),
    })
    return response.json()
  },
}
