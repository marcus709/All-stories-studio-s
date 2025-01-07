import { Settings, Link2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit} className="gap-2">
          <Settings className="h-4 w-4" />
          Edit Event
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddConnection} className="gap-2">
          <Link2 className="h-4 w-4" />
          Add Connection
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};