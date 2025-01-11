import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface GroupHeaderProps {
  groupName: string;
  onBack: () => void;
}

export const GroupHeader = ({ groupName, onBack }: GroupHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 pb-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
        <h2 className="text-2xl font-semibold">{groupName}</h2>
      </div>
    </div>
  );
};