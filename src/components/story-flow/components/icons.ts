import {
  ArrowRight,
  GitBranch,
  Network,
  Circle,
  Clock,
  Grid,
  Boxes,
  TreeDeciduous,
  Map,
  Target,
  Hexagon,
  Star,
  Route,
  Layers
} from "lucide-react";
import { ViewMode } from "../types";

export const viewModeIcons: Record<ViewMode, React.ComponentType> = {
  linear: ArrowRight,
  branching: GitBranch,
  network: Network,
  radial: Circle,
  timeline: Clock,
  cluster: Boxes,
  grid: Grid,
  mindmap: Map,
  concentric: Target,
  hexagonal: Hexagon,
  starburst: Star,
  pathway: Route,
  layered: Layers,
  fractal: TreeDeciduous
};