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
    switch (viewMode) {
      case 'linear':
        return {
          nodes: nodes.map((node, index) => ({
            ...node,
            position: { x: 100 + index * 200, y: 100 },
          })),
          edges,
        };
      case 'branching':
        return {
          nodes: nodes.map((node, index) => ({
            ...node,
            position: { 
              x: 100 + (index % 3) * 300,
              y: 100 + Math.floor(index / 3) * 200,
            },
          })),
          edges,
        };
      case 'network':
        const radius = 300;
        const angle = (2 * Math.PI) / nodes.length;
        return {
          nodes: nodes.map((node, index) => ({
            ...node,
            position: {
              x: 400 + radius * Math.cos(index * angle),
              y: 300 + radius * Math.sin(index * angle),
            },
          })),
          edges,
        };
      case 'radial':
        const innerRadius = 150;
        const outerRadius = 300;
        return {
          nodes: nodes.map((node, index) => ({
            ...node,
            position: {
              x: 400 + (index % 2 ? outerRadius : innerRadius) * Math.cos(index * angle),
              y: 300 + (index % 2 ? outerRadius : innerRadius) * Math.sin(index * angle),
            },
          })),
          edges,
        };
      default:
        return { nodes, edges };
    }
  }, [viewMode, nodes, edges]);

  // Update layout when view mode changes
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