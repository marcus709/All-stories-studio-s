import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeTypes,
  Connection,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TimelineNode from './TimelineNode';
import { TimelineNodeData, TimelineNode as TimelineNodeType, TimelineEdge } from './types/timeline';
import { initialNodes, initialEdges } from './data/initialElements';

export const StoryFlowTimeline = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNodeAdd = useCallback(() => {
    const newNode: Node<TimelineNodeData> = {
      id: `node-${nodes.length + 1}`,
      type: 'timeline',
      position: { x: 100, y: 100 },
      data: {
        label: 'New Event',
        subtitle: 'Description',
        year: '2024',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const handleNodeEdit = useCallback((nodeId: string, newData: TimelineNodeData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: newData };
        }
        return node;
      })
    );
  }, [setNodes]);

  const nodeTypes = useMemo<NodeTypes>(() => ({
    timeline: TimelineNode,
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