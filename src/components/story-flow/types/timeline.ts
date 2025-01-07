import { Node, Edge } from '@xyflow/react';

export interface TimelineNodeData {
  label: string;
  subtitle?: string;
  year?: string;
  [key: string]: unknown;
}

export type TimelineNode = Node<TimelineNodeData>;
export type TimelineEdge = Edge;

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