import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface GroupHeaderProps {
  groupName: string;
  onBack: () => void;
}

export const GroupHeader = ({ groupName, onBack }: GroupHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Groups
      </Button>
      <h2 className="text-2xl font-semibold">{groupName}</h2>
    </div>
  );
};