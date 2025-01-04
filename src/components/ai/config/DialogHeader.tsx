import { DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DialogHeaderProps {
  isEditing: boolean;
}

export function ConfigDialogHeader({ isEditing }: DialogHeaderProps) {
  return (
    <UIDialogHeader>
      <DialogTitle>{isEditing ? "Edit" : "Create"} AI Configuration</DialogTitle>
      <DialogDescription>
        Configure how the AI assistant will help with your writing.
      </DialogDescription>
    </UIDialogHeader>
  );
}