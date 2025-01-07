export type ViewMode = "linear" | "branching" | "network" | "radial" | "timeline" | 
                      "cluster" | "grid" | "mindmap" | "concentric" | "hexagonal" | 
                      "starburst" | "pathway" | "layered" | "fractal";

export const viewModeLabels: Record<ViewMode, string> = {
  linear: "Linear",
  branching: "Branching",
  network: "Network",
  radial: "Radial",
  timeline: "Timeline",
  cluster: "Cluster",
  grid: "Grid",
  mindmap: "Mind Map",
  concentric: "Concentric Circles",
  hexagonal: "Hexagonal Web",
  starburst: "Starburst",
  pathway: "Pathway",
  layered: "Layered",
  fractal: "Fractal"
};