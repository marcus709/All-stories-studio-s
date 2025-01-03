import { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import { Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import '@xyflow/react/dist/style.css';

const TimelineNode = ({ data, id }: { data: any; id: string }) => {
  const { toast } = useToast();
  const [nodes, setNodes] = useNodesState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(data.label);
  const [editedSubtitle, setEditedSubtitle] = useState(data.subtitle);

  const handleEdit = () => {
    toast({
      title: "Edit Event",
      description: `Editing event: ${data.label}`,
    });
  };

  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    toast({
      title: "Delete Event",
      description: `Deleted event: ${data.label}`,
    });
  };

  const handleAddConnection = () => {
    toast({
      title: "Add Connection",
      description: `Adding connection from: ${data.label}`,
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Here you would typically update the node data in your state management
    data.label = editedLabel;
    data.subtitle = editedSubtitle;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      handleBlur();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 min-w-[200px]">
      <div className="flex justify-between items-start mb-2">
        <div>
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
                autoFocus
              />
              <input
                type="text"
                value={editedSubtitle}
                onChange={(e) => setEditedSubtitle(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1"
              />
            </div>
          ) : (
            <div onDoubleClick={handleDoubleClick}>
              <h3 className="font-medium text-gray-900">{data.label}</h3>
              <p className="text-sm text-gray-500">{data.subtitle}</p>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 hover:bg-gray-100 rounded">
            <Settings className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleEdit}>
              Edit Event
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddConnection}>
              Add Connection
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-xs text-gray-400">{data.year}</div>
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

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const nodeTypes = useMemo(
    () => ({
      timeline: TimelineNode,
    }),
    []
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
      className="bg-gray-50"
    >
      <Background />
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
  );
};