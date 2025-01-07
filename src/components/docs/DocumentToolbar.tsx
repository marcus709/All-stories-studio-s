import { Button } from "../ui/button";
import { Clock, Save } from "lucide-react";

interface DocumentToolbarProps {
  onSave: () => void;
  onTimeAnalysis: () => void;
  isSaving: boolean;
}

export function DocumentToolbar({ onSave, onTimeAnalysis, isSaving }: DocumentToolbarProps) {
  return (
    <div className="flex justify-end gap-2 p-4 border-t bg-white">
      <Button variant="outline" onClick={onTimeAnalysis} className="gap-2">
        <Clock className="w-4 h-4" />
        Analyze Time Period
      </Button>
      <Button
        onClick={onSave}
        disabled={isSaving}
        className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 gap-2"
      >
        <Save className="w-4 h-4" />
        {isSaving ? "Saving..." : "Save Document"}
      </Button>
    </div>
  );
}