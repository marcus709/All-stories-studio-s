import { 
  Clock,
  Group,
  Grid,
  CircleOff,
  GitBranch,
  GitCommit,
  Network,
  CircleDot,
  Hexagon,
  Sun,
  Route,
  Layers,
  Globe,
  Snowflake,
  LucideIcon
} from 'lucide-react';
import { ViewMode } from '../types';

export const viewModeIcons: Record<ViewMode, LucideIcon> = {
  timeline: Clock,
  cluster: Group,
  grid: Grid,
  spiral: CircleOff,
  tree: GitBranch,
  flowchart: GitCommit,
  mindmap: Network,
  concentric: CircleDot,
  hexagonal: Hexagon,
  starburst: Sun,
  pathway: Route,
  layered: Layers,
  sphere: Globe,
  fractal: Snowflake
};