import { useCallback } from 'react';
import { Connection, Edge, Node, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { useToast } from '@/components/ui/use-toast';
import { getLayoutedElements } from '../utils/layoutUtils';

export const useFlowState = (viewMode: 'linear' | 'branching' | 'network') => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { toast } = useToast();

  const applyLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, viewMode);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, viewMode, setNodes, setEdges]);

  const handleConnect = useCallback(
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
      draggable: true, // Ensure nodes are draggable
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

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    handleConnect,
    handleAddNode,
    handleDeleteNode,
    applyLayout,
  };
};