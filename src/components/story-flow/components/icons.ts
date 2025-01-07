import {
  ArrowRight,
  GitBranch,
  Network,
  Circle
} from "lucide-react";
import { ViewMode } from "../types";

export const viewModeIcons: Record<ViewMode, React.ComponentType> = {
  linear: ArrowRight,
  branching: GitBranch,
  network: Network,
  radial: Circle
};