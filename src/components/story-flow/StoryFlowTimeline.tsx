import { useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  Controls,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TimelineNode } from './TimelineNode';
import { AddEventDialog } from './AddEventDialog';
import { useFlowState } from './hooks/useFlowState';
import { useToast } from '@/hooks/use-toast';

interface StoryFlowTimelineProps {
  viewMode: 'linear' | 'branching' | 'network';
}

export const StoryFlowTimeline = ({ viewMode }: StoryFlowTimelineProps) => {
  const [isAddingNode, setIsAddingNode] = useState(false);
  const { toast } = useToast();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    handleConnect,
    handleAddNode,
    handleDeleteNode,
    applyLayout,
  } = useFlowState(viewMode);

  useEffect(() => {
    applyLayout();
  }, [viewMode, applyLayout]);

  const handleEditNode = (id: string) => {
    toast({
      title: "Edit Event",
      description: `Editing event with ID: ${id}`,
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
        onConnect={handleConnect}
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