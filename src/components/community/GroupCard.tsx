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
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-100/50 p-6 flex flex-col justify-between hover:shadow-purple-200/50 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        onClick();
      }}
    >
      <div>
        <h3 className="font-medium text-gray-900 text-lg mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{group.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {group.description}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-sm bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 px-3 py-1 rounded-full">
            {group.group_members?.length || 1} member
            {group.group_members?.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        {isCreator ? (
          <Button variant="ghost" size="icon" onClick={onDelete} className="hover:bg-red-50 hover:text-red-600 transition-colors">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={onLeave} className="hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="h-4 w-4 text-red-500" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onSettings} className="hover:bg-purple-50 hover:text-purple-600 transition-colors">
          <Settings className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};