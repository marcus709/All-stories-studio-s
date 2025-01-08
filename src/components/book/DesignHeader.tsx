import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DesignHeaderProps {
  onResetDesign: () => void;
  onSaveDesign: () => void;
}

export const DesignHeader = ({ onResetDesign, onSaveDesign }: DesignHeaderProps) => {
  const { toast } = useToast();

  const handleResetDesign = () => {
    onResetDesign();
    toast({
      title: "Design Reset",
      description: "Your cover design has been reset.",
    });
  };

  const handleSaveDesign = () => {
    onSaveDesign();
    toast({
      title: "Design Saved",
      description: "Your cover design has been saved successfully.",
    });
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Virtual Book Designer</h1>
        <p className="text-gray-500">Create your perfect book cover</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleResetDesign}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Design
        </Button>
        <Button className="bg-violet-500 hover:bg-violet-600" onClick={handleSaveDesign}>
          Save Cover
        </Button>
      </div>
    </div>
  );
};