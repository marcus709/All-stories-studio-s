import { useCallback } from 'react';
import { 
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Character } from '@/integrations/supabase/types/tables.types';
import { CharacterNode } from './CharacterNode';

interface CharacterDynamicsFlowProps {
  characters: Character[];
  relationships: any[];
}

const nodeTypes = {
  character: CharacterNode,
};

export const CharacterDynamicsFlow = ({ characters, relationships }: CharacterDynamicsFlowProps) => {
  // Transform characters into nodes
  const initialNodes = characters.map((char, index) => {
    const angle = (index * 2 * Math.PI) / characters.length;
    const radius = 300;
    return {
      id: char.id,
      type: 'character',
      position: {
        x: 400 + radius * Math.cos(angle),
        y: 300 + radius * Math.sin(angle),
      },
      data: { ...char },
    };
  });

  // Transform relationships into edges
  const initialEdges = relationships.map((rel) => ({
    id: rel.id,
    source: rel.character1_id,
    target: rel.character2_id,
    type: 'smoothstep',
    animated: true,
    style: { 
      stroke: getRelationshipColor(rel.relationship_type),
      strokeWidth: Math.max(1, Math.min(rel.strength / 20, 5)),
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: getRelationshipColor(rel.relationship_type),
    },
    label: rel.relationship_type,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.2}
      maxZoom={4}
      className="bg-gray-900"
    >
      <Background color="#666" gap={16} />
      <Controls className="bg-gray-800 text-white border-gray-700" />
      <MiniMap 
        nodeColor={(node) => {
          switch (node.type) {
            case 'character':
              return '#8b5cf6';
            default:
              return '#fff';
          }
        }}
        maskColor="rgba(0, 0, 0, 0.8)"
        className="bg-gray-800 border-gray-700"
      />
    </ReactFlow>
  );
};

function getRelationshipColor(type: string): string {
  switch (type) {
    case 'ally':
      return '#22c55e';
    case 'rival':
      return '#ef4444';
    case 'family':
      return '#8b5cf6';
    case 'friend':
      return '#3b82f6';
    case 'enemy':
      return '#dc2626';
    case 'mentor':
      return '#f59e0b';
    case 'student':
      return '#6366f1';
    default:
      return '#94a3b8';
  }
}