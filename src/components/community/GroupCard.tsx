import { Button } from "@/components/ui/button";
import { Trash2, Settings, LogOut } from "lucide-react";

interface GroupCardProps {
  group: any;
  isCreator: boolean;
  onDelete: () => void;
  onLeave: () => void;
  onSettings: () => void;
  onClick: () => void;
}

export const GroupCard = ({
  group,
  isCreator,
  onDelete,
  onLeave,
  onSettings,
  onClick,
}: GroupCardProps) => {
  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-4 flex flex-col justify-between cursor-pointer"
      onClick={(e) => {
        // Prevent clicking the card if clicking on a button
        if ((e.target as HTMLElement).closest("button")) return;
        onClick();
      }}
    >
      <div>
        <h3 className="font-medium text-lg mb-2">{group.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {group.description}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500">
            {group.group_members?.length || 1} member
            {group.group_members?.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        {isCreator ? (
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={onLeave}>
            <LogOut className="h-4 w-4 text-red-500" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onSettings}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};