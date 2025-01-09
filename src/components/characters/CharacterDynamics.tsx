import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, useNodesState, useEdgesState, addEdge, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Character } from '@/integrations/supabase/types/tables.types';
import { RelationshipType } from '@/types/relationships';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Play, Pause } from 'lucide-react';

const relationshipColors: Record<RelationshipType, string> = {
  'ally': '#22c55e',
  'rival': '#ef4444',
  'family': '#8b5cf6',
  'friend': '#3b82f6',
  'enemy': '#dc2626',
  'mentor': '#f59e0b',
  'student': '#6366f1',
};

interface CharacterDynamicsProps {
  characters: Character[];
}

export const CharacterDynamics = ({ characters }: CharacterDynamicsProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [synergy, setSynergy] = useState(75);

  const { data: relationships } = useQuery({
    queryKey: ['relationships', characters.map(c => c.id)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_relationships')
        .select('*')
        .in('character1_id', characters.map(c => c.id));
      if (error) throw error;
      return data;
    },
    enabled: characters.length > 0,
  });

  // Transform characters and relationships into nodes and edges
  const updateNodesAndEdges = useCallback(() => {
    if (!characters || !relationships) return;

    // Create a circular layout
    const radius = 200;
    const centerX = 400;
    const centerY = 300;
    
    const newNodes = characters.map((char, index) => {
      const angle = (index * 2 * Math.PI) / characters.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      return {
        id: char.id,
        type: 'characterNode',
        data: { 
          label: char.name,
          traits: char.traits || [],
          isActive: relationships?.some(
            rel => rel.character1_id === char.id || rel.character2_id === char.id
          )
        },
        position: { x, y },
        className: 'animate-fade-in'
      };
    });

    const newEdges = relationships?.map((rel) => ({
      id: rel.id,
      source: rel.character1_id,
      target: rel.character2_id,
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: relationshipColors[rel.relationship_type] || '#94a3b8',
        strokeWidth: rel.strength ? Math.max(1, Math.min(rel.strength / 20, 5)) : 1,
      },
      markerEnd: {
        type: MarkerType.Arrow,
        color: relationshipColors[rel.relationship_type] || '#94a3b8',
      },
      className: 'animate-fade-in'
    })) || [];

    setNodes(newNodes);
    setEdges(newEdges);
  }, [characters, relationships, setNodes, setEdges]);

  // Update visualization when data changes
  useCallback(() => {
    updateNodesAndEdges();
  }, [updateNodesAndEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleTimelineChange = (value: number[]) => {
    setTimelinePosition(value[0]);
    // Here you would update relationships based on the timeline position
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Here you would implement the animation logic
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Group Synergy</div>
          <div className="text-2xl font-bold text-purple-600">{synergy}%</div>
        </div>
        <Button variant="outline" onClick={togglePlayback} className="gap-2">
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Play Timeline
            </>
          )}
        </Button>
      </div>

      <div className="h-[500px] bg-white rounded-xl shadow-sm relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          minZoom={0.5}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => (node.data?.isActive ? '#000' : '#fff')}
            maskColor="rgba(255, 255, 255, 0.8)"
          />
        </ReactFlow>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm font-medium mb-2">Timeline</div>
        <Slider
          value={[timelinePosition]}
          onValueChange={handleTimelineChange}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>Story Start</span>
          <span>Current Event</span>
          <span>Story End</span>
        </div>
      </div>
    </div>
  );
};