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
import { Plus, Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@supabase/auth-helpers-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LayoutType = 'circular' | 'clustered' | 'timeline' | 'geographic';

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
  const session = useSession();
  const [layoutType, setLayoutType] = useState<LayoutType>('circular');

  const getNodePositions = (chars: Character[], layout: LayoutType) => {
    switch (layout) {
      case 'clustered':
        // Group characters by their traits/factions
        return chars.map((char, index) => {
          const group = char.traits?.[0] || 'unknown';
          const groupIndex = [...new Set(chars.map(c => c.traits?.[0] || 'unknown'))].indexOf(group);
          const radius = 300;
          const angleOffset = (groupIndex * Math.PI) / 3;
          const angle = angleOffset + (index * 2 * Math.PI) / chars.length;
          
          return {
            x: 400 + radius * Math.cos(angle),
            y: 300 + radius * Math.sin(angle),
          };
        });

      case 'timeline':
        // Arrange characters in a horizontal timeline
        return chars.map((_, index) => ({
          x: 200 + (index * 200),
          y: 300 + (Math.sin(index) * 100), // Slight wave pattern
        }));

      case 'geographic':
        // Arrange in a map-like grid
        const cols = Math.ceil(Math.sqrt(chars.length));
        return chars.map((_, index) => ({
          x: 200 + (index % cols) * 250,
          y: 200 + Math.floor(index / cols) * 250,
        }));

      case 'circular':
      default:
        // Original circular layout
        return chars.map((_, index) => {
          const angle = (index * 2 * Math.PI) / chars.length;
          const radius = 300;
          return {
            x: 400 + radius * Math.cos(angle),
            y: 300 + radius * Math.sin(angle),
          };
        });
    }
  };

  const positions = getNodePositions(characters, layoutType);
  
  const initialNodes = characters.map((char, index) => ({
    id: char.id,
    type: 'character',
    position: positions[index],
    data: { ...char },
  }));

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
    const newNodeId = `character-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'character',
      position: nextNodePosition,
      data: {
        id: newNodeId,
        name: 'New Character',
        role: 'Unknown',
        traits: [],
        goals: null,
        backstory: null,
        story_id: null,
        user_id: session?.user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isNew: true
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
  }, [nextNodePosition, setNodes, toast, session]);

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayoutType(newLayout);
    const newPositions = getNodePositions(characters, newLayout);
    setNodes(nodes.map((node, index) => ({
      ...node,
      position: newPositions[index],
    })));
  };

  return (
    <div className="w-full h-[600px] relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Select value={layoutType} onValueChange={(value: LayoutType) => handleLayoutChange(value)}>
          <SelectTrigger className="w-[180px] bg-white">
            <Layout className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circular">Circular Layout</SelectItem>
            <SelectItem value="clustered">Clustered View</SelectItem>
            <SelectItem value="timeline">Timeline View</SelectItem>
            <SelectItem value="geographic">Geographic View</SelectItem>
          </SelectContent>
        </Select>
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