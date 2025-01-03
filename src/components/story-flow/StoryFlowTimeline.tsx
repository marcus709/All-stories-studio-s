import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Connection,
  Edge,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Settings, Plus, X, Edit3, Link, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const TimelineNode = ({ data }: { data: any }) => {
  const { toast } = useToast();

  const handleEdit = () => {
    toast({
      title: "Edit Event",
      description: `Editing event: ${data.label}`,
    });
  };

  const handleDelete = () => {
    toast({
      title: "Delete Event",
      description: `Deleting event: ${data.label}`,
      variant: "destructive",
    });
  };

  const handleAddConnection = () => {
    toast({
      title: "Add Connection",
      description: "Click another node to create a connection",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{data.year}</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Settings className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Event
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddConnection}>
              <Link className="h-4 w-4 mr-2" />
              Add Connection
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h3 className="font-medium mb-1">{data.label}</h3>
      <p className="text-sm text-gray-600">{data.subtitle}</p>
    </div>
  );
};

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
  const [isConnecting, setIsConnecting] = useState(false);
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

  const nodeTypes = {
    timeline: TimelineNode,
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
    </div>
  );
};