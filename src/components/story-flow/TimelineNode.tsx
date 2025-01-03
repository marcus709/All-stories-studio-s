import { useState } from 'react';
import { Settings, Edit3, Link, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export interface TimelineNodeData {
  label: string;
  subtitle: string;
  year: string;
  isParent?: boolean;
  children?: string[];
}

interface TimelineNodeProps {
  data: TimelineNodeData;
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddConnection?: (id: string) => void;
  onAddSubEvent?: (id: string) => void;
}

export const TimelineNode = ({ 
  data, 
  id, 
  onEdit,
  onDelete,
  onAddConnection,
  onAddSubEvent 
}: TimelineNodeProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id);
    } else {
      toast({
        title: "Edit Event",
        description: `Editing event: ${data.label}`,
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    } else {
      toast({
        title: "Delete Event",
        description: `Deleting event: ${data.label}`,
        variant: "destructive",
      });
    }
  };

  const handleAddConnection = () => {
    if (onAddConnection) {
      onAddConnection(id);
    } else {
      toast({
        title: "Add Connection",
        description: "Click another node to create a connection",
      });
    }
  };

  const handleAddSubEvent = () => {
    if (onAddSubEvent) {
      onAddSubEvent(id);
    } else {
      toast({
        title: "Add Sub-Event",
        description: "Creating a new sub-event",
      });
    }
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
            <DropdownMenuItem onClick={handleAddSubEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sub-Event
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