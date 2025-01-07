import { GitCommit, GitBranch, Network, CircleDot, LucideIcon } from 'lucide-react';
import { ViewMode } from '../types';

export const viewModeIcons: Record<ViewMode, LucideIcon> = {
  linear: GitCommit,
  branching: GitBranch,
  network: Network,
  radial: CircleDot,
};