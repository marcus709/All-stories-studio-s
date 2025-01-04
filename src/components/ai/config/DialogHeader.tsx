import { DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DialogHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

export function ConfigDialogHeader({ isEditing, onClose }: DialogHeaderProps) {
  return (
    <UIDialogHeader>
      <DialogTitle>{isEditing ? "Edit" : "Create"} AI Configuration</DialogTitle>
      <DialogDescription>
        Configure how the AI assistant will help with your writing.
      </DialogDescription>
      <Button
        type="button"
        variant="ghost"
        className="absolute right-4 top-4"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </UIDialogHeader>
  );
}