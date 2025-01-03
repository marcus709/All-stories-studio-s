import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Controls,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { TimelineNode } from './TimelineNode';
import { AddEventDialog } from './AddEventDialog';

const initialNodes = [
  {
    id: '1',
    type: 'timeline',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Story Beginning',
      subtitle: 'The journey begins...',
      year: '2018'
    },
  },
  {
    id: '2',
    type: 'timeline',
    position: { x: 300, y: 100 },
    data: { 
      label: 'First Challenge',
      subtitle: 'Our hero faces...',
      year: '2019'
    },
  },
  {
    id: '3',
    type: 'timeline',
    position: { x: 500, y: 100 },
    data: { 
      label: 'Major Conflict',
      subtitle: 'The stakes rise...',
      year: '2020'
    },
  },
  {
    id: '4',
    type: 'timeline',
    position: { x: 700, y: 100 },
    data: { 
      label: 'Plot Twist',
      subtitle: 'Everything changes...',
      year: '2021'
    },
  },
  {
    id: '5',
    type: 'timeline',
    position: { x: 900, y: 100 },
    data: { 
      label: 'Resolution',
      subtitle: 'Peace at last...',
      year: '2022'
    },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' },
];

interface StoryFlowTimelineProps {
  viewMode: 'linear' | 'branching' | 'network';
}

export const StoryFlowTimeline = ({ viewMode }: StoryFlowTimelineProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      toast({
        title: "Connection Created",
        description: "New connection added between events",
      });
    },
    [setEdges, toast],
  );

  const handleAddNode = (data: { label: string; subtitle: string; year: string }) => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: 'timeline',
      position: { x: 100, y: 100 },
      data,
    };
    setNodes((nds) => [...nds, newNode]);
    toast({
      title: "Event Added",
      description: "New event has been created",
    });
  };

  const handleEditNode = (id: string) => {
    toast({
      title: "Edit Event",
      description: `Editing event with ID: ${id}`,
    });
  };

  const handleDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    toast({
      title: "Event Deleted",
      description: "Event has been removed",
      variant: "destructive",
    });
  };

  const handleAddConnection = (id: string) => {
    toast({
      title: "Add Connection",
      description: `Click another node to connect with node ${id}`,
    });
  };

  const nodeTypes = {
    timeline: (props: any) => (
      <TimelineNode
        {...props}
        onEdit={handleEditNode}
        onDelete={handleDeleteNode}
        onAddConnection={handleAddConnection}
      />
    ),
  };

  return (
    <div className="h-[600px] bg-gray-50 rounded-xl relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Panel position="top-right" className="bg-white p-2 rounded-lg shadow-sm">
          <Button 
            onClick={() => setIsAddingNode(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </Panel>
        <Background />
        <Controls />
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

      <AddEventDialog
        isOpen={isAddingNode}
        onClose={() => setIsAddingNode(false)}
        onSubmit={handleAddNode}
      />
    </div>
  );
};
