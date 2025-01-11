import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface GroupHeaderProps {
  groupName: string;
  onBack: () => void;
}

export const GroupHeader = ({ groupName, onBack }: GroupHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 py-3">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
        <h2 className="text-xl font-semibold">{groupName}</h2>
      </div>
    </div>
  );
};