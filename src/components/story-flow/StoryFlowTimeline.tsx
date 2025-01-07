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
import { TimelineNode as TimelineNodeType, TimelineEdge } from './types/timeline';
import { initialNodes, initialEdges } from './data/initialElements';

export const StoryFlowTimeline = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<TimelineNodeType>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<TimelineEdge>(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const nodeTypes = useMemo<NodeTypes>(() => ({
    timeline: TimelineNode as any,
  }), []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
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