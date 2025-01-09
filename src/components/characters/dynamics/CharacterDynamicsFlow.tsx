import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MarkerType,
  EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Character } from '@/integrations/supabase/types/tables.types';
import CharacterNode from './CharacterNode';
import RelationshipEdge, { RelationshipEdgeData } from './RelationshipEdge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CharacterDynamicsFlowProps {
  characters: Character[];
  relationships: any[];
}

const nodeTypes = {
  character: CharacterNode,
};

const edgeTypes: EdgeTypes = {
  relationship: RelationshipEdge,
};

export const CharacterDynamicsFlow = ({ characters, relationships }: CharacterDynamicsFlowProps) => {
  const { toast } = useToast();
  const [nextNodePosition, setNextNodePosition] = useState({ x: 100, y: 100 });

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

  const initialEdges: Edge<RelationshipEdgeData>[] = relationships.map((rel) => ({
    id: rel.id,
    source: rel.character1_id,
    target: rel.character2_id,
    type: 'relationship',
    animated: true,
    data: {
      type: rel.relationship_type,
      strength: rel.strength,
      notes: rel.description,
      trust: rel.trust,
      conflict: rel.conflict,
      chemistry: rel.chemistry,
      id: rel.id,
      source: rel.character1_id,
      target: rel.character2_id,
    },
    style: { 
      stroke: getRelationshipColor(rel.relationship_type),
      strokeWidth: Math.max(1, Math.min(rel.strength / 20, 5)),
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: getRelationshipColor(rel.relationship_type),
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<RelationshipEdgeData>>(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddNode = useCallback(() => {
    const newNode = {
      id: `character-${Date.now()}`,
      type: 'character',
      position: nextNodePosition,
      data: {
        name: 'New Character',
        role: 'Unknown',
        traits: [],
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNextNodePosition(prev => ({
      x: prev.x + 50,
      y: prev.y + 50
    }));

    toast({
      title: "Character Added",
      description: "A new character node has been added to the flow.",
    });
  }, [nextNodePosition, setNodes, toast]);

  return (
    <div className="w-full h-[600px] relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={handleAddNode}
          className="bg-purple-500 hover:bg-purple-600 gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Character
        </Button>
      </div>

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
    </div>
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