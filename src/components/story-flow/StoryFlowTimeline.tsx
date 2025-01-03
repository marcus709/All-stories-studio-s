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

const getLayoutedElements = (nodes: any[], edges: any[], type: 'linear' | 'branching' | 'network') => {
  const spacing = 100;
  
  if (type === 'linear') {
    // Linear layout: events in a straight line
    return {
      nodes: nodes.map((node, index) => ({
        ...node,
        position: { x: index * 250, y: 100 },
      })),
      edges,
    };
  } else if (type === 'branching') {
    // Branching layout: tree-like structure
    return {
      nodes: nodes.map((node, index) => {
        const level = Math.floor(index / 2);
        const offset = index % 2 === 0 ? -150 : 150;
        return {
          ...node,
          position: { 
            x: level * 300,
            y: 100 + offset
          },
        };
      }),
      edges,
    };
  } else {
    // Network layout: circular arrangement
    const radius = 200;
    const angleStep = (2 * Math.PI) / nodes.length;
    
    return {
      nodes: nodes.map((node, index) => ({
        ...node,
        position: {
          x: 300 + radius * Math.cos(index * angleStep),
          y: 300 + radius * Math.sin(index * angleStep),
        },
      })),
      edges,
    };
  }
};

interface StoryFlowTimelineProps {
  viewMode: 'linear' | 'branching' | 'network';
}

export const StoryFlowTimeline = ({ viewMode }: StoryFlowTimelineProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const { toast } = useToast();

  // Apply layout when viewMode changes
  const applyLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, viewMode);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, viewMode, setNodes, setEdges]);

  // Update layout when viewMode changes
  React.useEffect(() => {
    applyLayout();
  }, [viewMode, applyLayout]);

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
      position: { x: 0, y: 0 },
      data,
    };
    
    setNodes((nds) => {
      const updatedNodes = [...nds, newNode];
      const { nodes: layoutedNodes } = getLayoutedElements(updatedNodes, edges, viewMode);
      return layoutedNodes;
    });
    
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
    setNodes((nds) => {
      const remainingNodes = nds.filter((node) => node.id !== id);
      const { nodes: layoutedNodes } = getLayoutedElements(remainingNodes, edges, viewMode);
      return layoutedNodes;
    });
    
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