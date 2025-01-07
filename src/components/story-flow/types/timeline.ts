import { Node, Edge } from '@xyflow/react';

export interface TimelineNodeData {
  label: string;
  subtitle?: string;
  year?: string;
  [key: string]: any; // This allows for additional properties
}

export type TimelineNode = Node<TimelineNodeData>;
export type TimelineEdge = Edge;