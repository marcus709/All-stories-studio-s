import { Node, Edge } from '@xyflow/react';

export interface TimelineNodeData {
  label: string;
  subtitle?: string;
  year?: string;
  data?: Record<string, unknown>;
  id: string;
  position: { x: number; y: number };
}

export type TimelineNode = Node<TimelineNodeData>;
export type TimelineEdge = Edge;