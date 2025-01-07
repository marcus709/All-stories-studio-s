export type ViewMode = 
  | "timeline"
  | "cluster"
  | "grid"
  | "spiral"
  | "tree"
  | "flowchart"
  | "mindmap"
  | "concentric"
  | "hexagonal"
  | "starburst"
  | "pathway"
  | "layered"
  | "sphere"
  | "fractal";

export const viewModeLabels: Record<ViewMode, string> = {
  timeline: "Timeline",
  cluster: "Cluster",
  grid: "Grid",
  spiral: "Spiral",
  tree: "Tree",
  flowchart: "Flowchart",
  mindmap: "Mind Map",
  concentric: "Concentric",
  hexagonal: "Hexagonal Web",
  starburst: "Starburst",
  pathway: "Pathway",
  layered: "Layered",
  sphere: "3D Sphere",
  fractal: "Fractal"
};