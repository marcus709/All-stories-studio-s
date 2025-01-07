import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TimelineNode } from './TimelineNode';
import { ViewMode } from "./types";
import { getNodeStyle } from './styles/nodeStyles';

const initialNodes = [
  {
    id: '1',
    type: 'timeline',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Story Beginning',
      subtitle: 'The journey begins...',
      year: '2018'
    },
  },
  {
    id: '2',
    type: 'timeline',
    position: { x: 300, y: 100 },
    data: { 
      label: 'First Challenge',
      subtitle: 'Our hero faces...',
      year: '2019'
    },
  },
  {
    id: '3',
    type: 'timeline',
    position: { x: 500, y: 100 },
    data: { 
      label: 'Major Conflict',
      subtitle: 'The stakes rise...',
      year: '2020'
    },
  },
  {
    id: '4',
    type: 'timeline',
    position: { x: 700, y: 100 },
    data: { 
      label: 'Plot Twist',
      subtitle: 'Everything changes...',
      year: '2021'
    },
  },
  {
    id: '5',
    type: 'timeline',
    position: { x: 900, y: 100 },
    data: { 
      label: 'Resolution',
      subtitle: 'Peace at last...',
      year: '2022'
    },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' },
];

interface StoryFlowTimelineProps {
  viewMode: ViewMode;
}

export const StoryFlowTimeline = ({ viewMode }: StoryFlowTimelineProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const nodeTypes = useMemo(
    () => ({
      timeline: TimelineNode,
    }),
    []
  );

  const getLayoutedElements = useCallback(() => {
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
        // For sphere and fractal, we'll use a simplified 2D representation
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
  }, [viewMode, nodes, edges]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements();

  return (
    <ReactFlow
      nodes={layoutedNodes}
      edges={layoutedEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      className="bg-gray-50"
    >
      <Background />
      <MiniMap
        style={{
          backgroundColor: 'white',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          width: 200,
          height: 120,
        }}
        maskColor="rgba(0, 0, 0, 0.1)"
        nodeColor="#4f46e5"
      />
    </ReactFlow>
  );
};