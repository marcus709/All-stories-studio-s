import { TimelineNode, TimelineEdge } from '../types/timeline';
import { ViewMode } from "../types";

export const getLayoutedElements = (
  nodes: TimelineNode[],
  edges: TimelineEdge[],
  viewMode: ViewMode
): { nodes: TimelineNode[]; edges: TimelineEdge[] } => {
  const spacing = 200;
  const radius = 300;
  const nodeCount = nodes.length;
  
  switch (viewMode) {
    case 'timeline':
      return {
        nodes: nodes.map((node, index) => ({
          ...node,
          position: { x: index * spacing, y: 100 },
        })),
        edges,
      };
    
    case 'cluster':
      return {
        nodes: nodes.map((node, index) => ({
          ...node,
          position: {
            x: 200 + Math.cos(index * 2 * Math.PI / (nodeCount / 2)) * radius,
            y: 200 + Math.sin(index * 2 * Math.PI / (nodeCount / 2)) * radius,
          },
        })),
        edges,
      };
    
    case 'spiral':
      return {
        nodes: nodes.map((node, index) => {
          const angle = index * 0.5;
          const radius = 50 + index * 20;
          return {
            ...node,
            position: {
              x: 300 + Math.cos(angle) * radius,
              y: 300 + Math.sin(angle) * radius,
            },
          };
        }),
        edges,
      };
    
    case 'concentric':
      return {
        nodes: nodes.map((node, index) => {
          const level = Math.floor(Math.sqrt(index));
          const angleStep = 2 * Math.PI / (level || 1);
          const angle = index * angleStep;
          return {
            ...node,
            position: {
              x: 300 + Math.cos(angle) * (level * spacing),
              y: 300 + Math.sin(angle) * (level * spacing),
            },
          };
        }),
        edges,
      };
    
    default:
      return { nodes, edges };
  }
};