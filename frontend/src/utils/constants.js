import {Newspaper,List, LayoutGrid, Grid, SwitchCamera } from "lucide-react"
export const API_ENDPOINTS = {
  WIDGETS: "/api/widgets",
  FEEDS: "/api/feeds",
  CATALOG: "/api/catalog",
  FOLDERS: "/api/folders",
  SUPPORT: "/api/support",
}

export const WIDGET_DEFAULTS = {
  width: 350,
  height: 300,
  responsive: true,
  titleSize: 16,
  titleColor: "#000000",
  titleBold: false,
  showAuthor: true,
  showDate: true,
  postCount: 10,
  viewType: "magazine",
  layoutType: "magazine1", // Default to list1 as it's the first available
  fontStyle: "Arial",
  textAlign: "left",
  showBorder: false,
  borderColor: "#dbdbdb",
  cornerStyle: "square",
}

export const VIEW_TYPES = [
  { type: "magazine", icon: Newspaper, label: "Magazine" },
  { type: "list", icon: List, label: "List" },
  { type: "matrixcard", icon: LayoutGrid, label: "Matrix Card" },
  { type: "grid", icon: Grid, label: "Grid" },
  { type: "carousel", icon: SwitchCamera, label: "Carousel" },
]

export const VIEW_LAYOUTS = {
  magazine: [
    { id: "magazine1", label: "Magazine Layout 1", image: "/views-thumbnails/magazine-layout1.png" },
    { id: "magazine2", label: "Magazine Layout 2", image: "/views-thumbnails/magazine-layout2.png" },
  ],
  list: [{ id: "list1", label: "List Layout", image: "/views-thumbnails/list-layout.png" }],
  matrixcard: [
    { id: "matrixcard1", label: "Matrix Card Layout 1", image: "/views-thumbnails/matrixcard-layout1.png" },
    { id: "matrixcard2", label: "Matrix Card Layout 2", image: "/views-thumbnails/matrixcard-layout2.png" },
  ],
  grid: [
    { id: "grid1", label: "Grid Layout 1", image: "/views-thumbnails/grid-layout1.png" },
    { id: "grid2", label: "Grid Layout 2", image: "/views-thumbnails/grid-layout2.png" },
  ],
  carousel: [
    { id: "carousel1", label: "Carousel Layout 1", image: "/views-thumbnails/carousel-layout1.png" },
    { id: "carousel2", label: "Carousel Layout 2", image: "/views-thumbnails/carousel-layout2.png" },
  ],
}
