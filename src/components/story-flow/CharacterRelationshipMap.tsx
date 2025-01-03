import { useCallback, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStory } from '@/contexts/StoryContext';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { AddRelationshipDialog } from './AddRelationshipDialog';
import { useToast } from '@/hooks/use-toast';

const relationshipColors = {
  'ALLY': '#22c55e',
  'RIVAL': '#ef4444',
  'FAMILY': '#8b5cf6',
  'FRIEND': '#3b82f6',
  'ENEMY': '#dc2626',
  'MENTOR': '#f59e0b',
  'STUDENT': '#6366f1',
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
        title: 'Success',
        description: 'Relationship deleted successfully',
      });
    },
  });

  // Transform characters and relationships into nodes and edges
  const updateNodesAndEdges = useCallback(() => {
    if (!characters || !relationships) return;

    const newNodes: Node[] = characters.map((char, index) => ({
      id: char.id,
      data: { label: char.name },
      position: {
        x: 250 + Math.cos(index * 2 * Math.PI / characters.length) * 200,
        y: 250 + Math.sin(index * 2 * Math.PI / characters.length) * 200,
      },
      type: 'default',
    }));

    const newEdges: Edge[] = relationships.map((rel) => ({
      id: rel.id,
      source: rel.character1_id,
      target: rel.character2_id,
      label: rel.relationship_type,
      type: 'smoothstep',
      style: { 
        stroke: relationshipColors[rel.relationship_type as keyof typeof relationshipColors] || '#94a3b8',
        strokeWidth: rel.strength ? Math.max(1, Math.min(rel.strength / 20, 5)) : 1,
      },
      data: { strength: rel.strength },
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
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      <AddRelationshipDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        characters={characters || []}
        storyId={selectedStory.id}
      />
    </div>
  );
};