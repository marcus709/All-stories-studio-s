import { X } from "lucide-react";
import { Button } from "../ui/button";
import { DialogHeader, DialogTitle } from "../ui/dialog";

interface StoriesDialogHeaderProps {
  onClose: () => void;
}

export const StoriesDialogHeader = ({ onClose }: StoriesDialogHeaderProps) => {
  return (
    <DialogHeader>
      <div className="flex justify-between items-center">
        <DialogTitle className="text-2xl font-bold">Your Stories</DialogTitle>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </DialogHeader>
  );
};