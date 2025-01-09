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
  MarkerType,
  Panel,
  Edge,
  EdgeProps
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Character } from '@/integrations/supabase/types/tables.types';
import CharacterNode from './CharacterNode';
import RelationshipEdge from './RelationshipEdge';

interface CharacterDynamicsFlowProps {
  characters: Character[];
  relationships: any[];
}

const nodeTypes = {
  character: CharacterNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

export const CharacterDynamicsFlow = ({ characters, relationships }: CharacterDynamicsFlowProps) => {
  // Transform characters into nodes with circular layout
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
      style: { fontSize: 12 }
    };
  });

  // Transform relationships into edges with enhanced styling
  const initialEdges = relationships.map((rel) => ({
    id: rel.id,
    source: rel.character1_id,
    target: rel.character2_id,
    type: 'relationship',
    animated: true,
    data: {
      type: rel.relationship_type,
      strength: rel.strength || 50,
      notes: rel.description || '',
      trust: rel.trust || 60,
      conflict: rel.conflict || 40,
      chemistry: rel.chemistry || 'High'
    },
    style: { 
      stroke: getRelationshipColor(rel.relationship_type),
      strokeWidth: Math.max(1, Math.min(rel.strength / 20, 5)),
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: getRelationshipColor(rel.relationship_type),
    },
    className: 'relationship-edge',
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Add zoom controls
  const onZoomIn = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: { ...node.style, fontSize: (node.style?.fontSize || 12) + 2 },
      }))
    );
  }, [setNodes]);

  const onZoomOut = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: { ...node.style, fontSize: Math.max((node.style?.fontSize || 12) - 2, 8) },
      }))
    );
  }, [setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      minZoom={0.2}
      maxZoom={4}
      className="bg-gray-900"
      snapToGrid={true}
      snapGrid={[15, 15]}
    >
      <Background color="#666" gap={16} />
      <Controls 
        className="bg-gray-800 text-white border-gray-700"
        showInteractive={false}
        position="top-left"
      />
      <Panel position="top-right" className="bg-gray-800 p-2 rounded-lg">
        <button
          className="px-3 py-1 bg-purple-600 text-white rounded-lg mr-2 hover:bg-purple-700"
          onClick={() => onZoomIn()}
        >
          Zoom In
        </button>
        <button
          className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          onClick={() => onZoomOut()}
        >
          Zoom Out
        </button>
      </Panel>
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