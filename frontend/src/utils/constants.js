export const API_ENDPOINTS = {
  WIDGETS: "/api/widgets",
  FEEDS: "/api/feeds",
  CATALOG: "/api/catalog",
  FOLDERS: "/api/folders",
  SUPPORT: "/api/support",
}

export const WIDGET_DEFAULTS = {
  width: 350,
  height: 400,
  responsive: true,
  titleSize: 16,
  titleColor: "#000000",
  titleBold: false,
  showAuthor: true,
  showDate: true,
  postCount: 5,
  viewType: "list",
  fontStyle: "Arial",
  textAlign: "left",
  showBorder: false,
  borderColor: "#dbdbdb",
  cornerStyle: "square",
}

export const VIEW_TYPES = [
  { type: "list", icon: "☰", label: "List" },
  { type: "compact", icon: "≡", label: "Compact" },
  { type: "card", icon: "▦", label: "Card" },
  { type: "grid", icon: "⊞", label: "Grid" },
  { type: "magazine", icon: "▤", label: "Magazine" },
]
