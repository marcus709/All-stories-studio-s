import { Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TimelineNodeMenuProps {
  handleEdit: () => void;
  handleAddConnection: () => void;
  handleDelete: () => void;
}

export const TimelineNodeMenu = ({
  handleEdit,
  handleAddConnection,
  handleDelete,
}: TimelineNodeMenuProps) => {
  return (
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
  );
};