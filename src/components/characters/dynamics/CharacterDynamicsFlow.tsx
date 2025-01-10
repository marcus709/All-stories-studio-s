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
  EdgeTypes,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Character } from '@/types/character';
import CharacterNode from './CharacterNode';
import RelationshipEdge, { RelationshipEdgeData } from './RelationshipEdge';
import { Button } from '@/components/ui/button';
import { Plus, Layout, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@supabase/auth-helpers-react';
import { TimelineDialog } from './TimelineDialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStory } from '@/contexts/StoryContext';
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

const DEFAULT_POSITION = { x: 100, y: 100 };

export const CharacterDynamicsFlow = ({ characters, relationships }: CharacterDynamicsFlowProps) => {
  const { toast } = useToast();
  const [nextNodePosition, setNextNodePosition] = useState(DEFAULT_POSITION);
  const session = useSession();
  const [layoutType, setLayoutType] = useState<LayoutType>('circular');
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  const { selectedStory } = useStory();
  const queryClient = useQueryClient();

  // Fetch timeline events
  const { data: timelineEvents } = useQuery({
    queryKey: ['timeline-events', selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('story_id', selectedStory.id)
        .order('position');

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  // Analyze timeline events
  const { data: timelineAnalysis } = useQuery({
    queryKey: ['timeline-analysis', selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return null;

      const { data, error } = await supabase.functions.invoke('analyze-timeline-events', {
        body: { storyId: selectedStory.id }
      });

      if (error) throw error;
      return data.analysis;
    },
    enabled: !!selectedStory?.id,
  });

  const getNodePositions = (chars: Character[], layout: LayoutType) => {
    if (!chars || chars.length === 0) {
      return [DEFAULT_POSITION];
    }
    
    switch (layout) {
      case 'clustered':
        return chars.map((char, index) => {
          const group = char.traits?.[0] || 'unknown';
          const groupIndex = [...new Set(chars.map(c => c.traits?.[0] || 'unknown'))].indexOf(group);
          const radius = 300;
          const angleOffset = (groupIndex * Math.PI) / 3;
          const angle = angleOffset + (index * 2 * Math.PI) / chars.length;
          
          return {
            x: Math.max(400 + radius * Math.cos(angle), 0),
            y: Math.max(300 + radius * Math.sin(angle), 0),
          };
        });

      case 'timeline':
        return chars.map((_, index) => ({
          x: Math.max(200 + (index * 200), 0),
          y: Math.max(300 + (Math.sin(index) * 100), 0),
        }));

      case 'geographic':
        const cols = Math.ceil(Math.sqrt(chars.length));
        return chars.map((_, index) => ({
          x: Math.max(200 + (index % cols) * 250, 0),
          y: Math.max(200 + Math.floor(index / cols) * 250, 0),
        }));

      case 'circular':
      default:
        return chars.map((_, index) => {
          const angle = (index * 2 * Math.PI) / chars.length;
          const radius = 300;
          return {
            x: Math.max(400 + radius * Math.cos(angle), 0),
            y: Math.max(300 + radius * Math.sin(angle), 0),
          };
        });
    }
  };

  const positions = getNodePositions(characters, layoutType);
  
  const initialNodes = characters.map((char, index) => ({
    id: char.id,
    type: "character" as const,
    position: positions[index] || DEFAULT_POSITION,
    data: { ...char } as Record<string, unknown> & Character,
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
    if (!session?.user?.id) return;

    const newNodeId = `character-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'character' as const,
      position: nextNodePosition,
      data: {
        id: newNodeId,
        name: 'New Character',
        role: 'Unknown',
        traits: [],
        goals: null,
        backstory: null,
        story_id: null,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        psychology: {
          fears: [],
          mental_health: null,
          coping_mechanisms: [],
          emotional_tendencies: []
        },
        values_and_morals: {
          honesty: 50,
          loyalty: 50,
          alignment: {
            lawful_chaotic: 0,
            selfless_selfish: 0
          },
          risk_taking: 50
        },
        skills: [],
        flaws: [],
        archetype: null,
        psychological_traits: {
          trust: 50,
          resilience: 50,
          impulsiveness: 50,
          emotional_intelligence: 50
        },
        internal_motivations: [],
        external_goals: [],
        core_beliefs: [],
        social_masks: [],
        group_roles: [],
        behavioral_quirks: [],
        body_language: null,
        cultural_background: {
          taboos: [],
          traditions: [],
          religious_beliefs: []
        },
        life_events: {
          losses: [],
          formative: [],
          turning_points: []
        },
        ancestry: null,
        skill_trees: [],
        expertise: {
          areas: [],
          limitations: []
        },
        training_history: [],
        dialogue_style: {
          tone: [],
          patterns: [],
          formality: "neutral"
        },
        iconic_phrases: [],
        linguistic_traits: {
          accent: null,
          quirks: [],
          languages: []
        }
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNextNodePosition(prev => ({
      x: Math.max(prev.x + 50, 0),
      y: Math.max(prev.y + 50, 0),
    }));

    toast({
      title: "Character Added",
      description: "A new character node has been added to the flow.",
    });
  }, [nextNodePosition, setNodes, toast, session]);

  const handleLayoutChange = (newLayout: LayoutType) => {
    if (!characters || characters.length === 0) return;
    
    setLayoutType(newLayout);
    const newPositions = getNodePositions(characters, newLayout);
    
    setNodes((prevNodes) => 
      prevNodes.map((node, index) => ({
        ...node,
        position: newPositions[index] || node.position || DEFAULT_POSITION,
        data: {
          ...node.data,
          psychology: node.data.psychology || {
            fears: [],
            mental_health: null,
            coping_mechanisms: [],
            emotional_tendencies: []
          },
          values_and_morals: node.data.values_and_morals || {
            honesty: 50,
            loyalty: 50,
            alignment: {
              lawful_chaotic: 0,
              selfless_selfish: 0
            },
            risk_taking: 50
          },
          skills: node.data.skills || [],
          flaws: node.data.flaws || [],
          archetype: node.data.archetype || null,
          psychological_traits: node.data.psychological_traits || {
            trust: 50,
            resilience: 50,
            impulsiveness: 50,
            emotional_intelligence: 50
          },
          internal_motivations: node.data.internal_motivations || [],
          external_goals: node.data.external_goals || [],
          core_beliefs: node.data.core_beliefs || [],
          social_masks: node.data.social_masks || [],
          group_roles: node.data.group_roles || [],
          behavioral_quirks: node.data.behavioral_quirks || [],
          body_language: node.data.body_language || null,
          cultural_background: node.data.cultural_background || {
            taboos: [],
            traditions: [],
            religious_beliefs: []
          },
          life_events: node.data.life_events || {
            losses: [],
            formative: [],
            turning_points: []
          },
          ancestry: node.data.ancestry || null,
          skill_trees: node.data.skill_trees || [],
          expertise: node.data.expertise || {
            areas: [],
            limitations: []
          },
          training_history: node.data.training_history || [],
          dialogue_style: node.data.dialogue_style || {
            tone: [],
            patterns: [],
            formality: "neutral"
          },
          iconic_phrases: node.data.iconic_phrases || [],
          linguistic_traits: node.data.linguistic_traits || {
            accent: null,
            quirks: [],
            languages: []
          }
        }
      }))
    );
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
          onClick={() => setIsTimelineDialogOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 gap-2"
        >
          <Clock className="h-4 w-4" />
          Add Timeline Event
        </Button>
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

      {timelineEvents && timelineEvents.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">Timeline</h3>
            {timelineAnalysis && (
              <div className="text-sm text-gray-400">
                AI Analysis Available
              </div>
            )}
          </div>
          <div className="relative h-16">
            {timelineEvents.map((event) => (
              <div
                key={event.id}
                className="absolute top-0 bg-purple-500 px-2 py-1 rounded text-white text-xs cursor-pointer hover:bg-purple-600 transition-colors"
                style={{ left: `${(event.position / timelineEvents.length) * 100}%` }}
                title={`${event.title} (${event.year})`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      )}

      <TimelineDialog
        isOpen={isTimelineDialogOpen}
        onClose={() => setIsTimelineDialogOpen(false)}
        storyId={selectedStory?.id || ''}
        onEventAdded={() => {
          // Refetch timeline events
          queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
        }}
      />
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

