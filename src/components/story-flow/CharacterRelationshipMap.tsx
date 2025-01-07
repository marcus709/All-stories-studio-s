import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, useNodesState, useEdgesState, addEdge, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStory } from '@/contexts/StoryContext';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { AddRelationshipDialog } from './AddRelationshipDialog';
import { useToast } from '@/hooks/use-toast';
import { RelationshipType } from '@/types/relationships';
import RelationshipNode from './RelationshipNode';

const relationshipColors: Record<RelationshipType, string> = {
  'ally': '#22c55e',
  'rival': '#ef4444',
  'family': '#8b5cf6',
  'friend': '#3b82f6',
  'enemy': '#dc2626',
  'mentor': '#f59e0b',
  'student': '#6366f1',
};

const nodeTypes = {
  relationship: RelationshipNode,
};

export const CharacterRelationshipMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: characters } = useQuery({
    queryKey: ['characters', selectedStory?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('story_id', selectedStory?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  const { data: relationships } = useQuery({
    queryKey: ['relationships', selectedStory?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_relationships')
        .select('*')
        .eq('story_id', selectedStory?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  const deleteRelationshipMutation = useMutation({
    mutationFn: async (relationshipId: string) => {
      const { error } = await supabase
        .from('character_relationships')
        .delete()
        .eq('id', relationshipId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      toast({
        title: "Success",
        description: "Relationship deleted successfully",
      });
    },
  });

  // Transform characters and relationships into nodes and edges with neural network style
  const updateNodesAndEdges = useCallback(() => {
    if (!characters || !relationships) return;

    // Create a circular layout with some randomization for organic feel
    const radius = 200;
    const centerX = 400;
    const centerY = 300;
    
    const newNodes: Node[] = characters.map((char, index) => {
      const angle = (index * 2 * Math.PI) / characters.length;
      const randomOffset = Math.random() * 50; // Add some randomness to positions
      
      return {
        id: char.id,
        type: 'relationship',
        data: { 
          label: char.name.split(' ')[0], // Use first name only for cleaner display
          isActive: relationships.some(
            rel => rel.character1_id === char.id || rel.character2_id === char.id
          )
        },
        position: {
          x: centerX + (radius + randomOffset) * Math.cos(angle),
          y: centerY + (radius + randomOffset) * Math.sin(angle),
        },
      };
    });

    const newEdges: Edge[] = relationships.map((rel) => ({
      id: rel.id,
      source: rel.character1_id,
      target: rel.character2_id,
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: relationshipColors[rel.relationship_type as RelationshipType] || '#94a3b8',
        strokeWidth: rel.strength ? Math.max(1, Math.min(rel.strength / 20, 5)) : 1,
      },
      markerEnd: {
        type: MarkerType.Arrow,
        color: relationshipColors[rel.relationship_type as RelationshipType] || '#94a3b8',
      },
    }));

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

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center h-[600px] text-gray-500">
        Please select a story to view character relationships
      </div>
    );
  }

  return (
    <div className="h-[600px] bg-white rounded-xl shadow-sm relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-violet-500 hover:bg-violet-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Relationship
        </Button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
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

      <AddRelationshipDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        storyId={selectedStory.id}
      />
    </div>
  );
};