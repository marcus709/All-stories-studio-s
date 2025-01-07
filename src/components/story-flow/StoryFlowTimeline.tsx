import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TimelineNode from './TimelineNode';
import { ViewMode } from "./types";
import { TimelineNode as TimelineNodeType, TimelineEdge, TimelineNodeData } from './types/timeline';
import { initialNodes, initialEdges } from './data/initialElements';
import { getLayoutedElements } from './utils/layoutUtils';

interface StoryFlowTimelineProps {
  viewMode: ViewMode;
}

export const StoryFlowTimeline = ({ viewMode }: StoryFlowTimelineProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<TimelineNodeType>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<TimelineEdge>(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const nodeTypes = useMemo<NodeTypes>(() => ({
    timeline: TimelineNode,
  }), []);

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, viewMode);

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