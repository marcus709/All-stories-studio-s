import { TimelineNode, TimelineEdge } from '../types/timeline';
import { ViewMode } from "../types";
import { getNodeStyle } from '../styles/nodeStyles';

export const getLayoutedElements = (
  nodes: TimelineNode[],
  edges: TimelineEdge[],
  viewMode: ViewMode
): { nodes: TimelineNode[]; edges: TimelineEdge[] } => {
  const spacing = 100;
  const radius = 300;
  const nodeCount = nodes.length;
  
  const layoutedNodes = nodes.map((node, index) => ({
    ...node,
    style: getNodeStyle(viewMode, index, nodeCount),
    position: { x: index * spacing, y: 100 }, // Default position
  }));

  switch (viewMode) {
    case 'timeline':
      return {
        nodes: layoutedNodes.map((node, index) => ({
          ...node,
          position: { x: index * spacing, y: 100 },
        })),
        edges,
      };
    
    case 'cluster':
      return {
        nodes: layoutedNodes.map((node, index) => ({
          ...node,
          position: {
            x: 200 + Math.cos(index * 2 * Math.PI / (nodeCount / 2)) * radius,
            y: 200 + Math.sin(index * 2 * Math.PI / (nodeCount / 2)) * radius,
          },
        })),
        edges,
      };
    
    case 'grid':
      const cols = Math.ceil(Math.sqrt(nodeCount));
      return {
        nodes: nodes.map((node, index) => ({
          ...node,
          position: {
            x: (index % cols) * spacing,
            y: Math.floor(index / cols) * spacing,
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
    
    case 'tree':
      return {
        nodes: nodes.map((node, index) => ({
          ...node,
          position: {
            x: index * spacing,
            y: Math.floor(Math.log2(index + 1)) * spacing,
          },
        })),
        edges,
      };
    
    case 'flowchart':
      return {
        nodes: nodes.map((node, index) => ({
          ...node,
          position: { x: index * spacing, y: (index % 2) * spacing },
        })),
        edges,
      };
    
    case 'mindmap':
      return {
        nodes: nodes.map((node, index) => {
          const angle = (index * 2 * Math.PI) / nodeCount;
          return {
            ...node,
            position: {
              x: 300 + Math.cos(angle) * (index === 0 ? 0 : radius),
              y: 300 + Math.sin(angle) * (index === 0 ? 0 : radius),
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
    
    case 'hexagonal':
      return {
        nodes: nodes.map((node, index) => {
          const angle = (index * 2 * Math.PI) / 6;
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
    
    case 'starburst':
      return {
        nodes: nodes.map((node, index) => {
          const angle = (index * 2 * Math.PI) / (nodeCount - 1);
          return {
            ...node,
            position: {
              x: 300 + (index === 0 ? 0 : Math.cos(angle) * radius),
              y: 300 + (index === 0 ? 0 : Math.sin(angle) * radius),
            },
          };
        }),
        edges,
      };
    
    case 'pathway':
      return {
        nodes: nodes.map((node, index) => ({
          ...node,
          position: {
            x: index * spacing,
            y: 100 + Math.sin(index * 0.5) * 100,
          },
        })),
        edges,
      };
    
    case 'layered':
      return {
        nodes: nodes.map((node, index) => ({
          ...node,
          position: {
            x: (index % 3) * spacing,
            y: Math.floor(index / 3) * spacing,
          },
        })),
        edges,
      };
    
    case 'sphere':
    case 'fractal':
      return {
        nodes: nodes.map((node, index) => {
          const angle = (index * 2 * Math.PI) / nodeCount;
          const radiusVar = radius * (0.5 + Math.random() * 0.5);
          return {
            ...node,
            position: {
              x: 300 + Math.cos(angle) * radiusVar,
              y: 300 + Math.sin(angle) * radiusVar,
            },
          };
        }),
        edges,
      };
    
    default:
      return { nodes: layoutedNodes, edges };
  }
};