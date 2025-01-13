import { DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface StoriesDialogHeaderProps {
  showNewStory: boolean;
  setShowNewStory: (show: boolean) => void;
  showNewSharedStory: boolean;
  setShowNewSharedStory: (show: boolean) => void;
}

export const StoriesDialogHeader = ({ 
  showNewStory, 
  setShowNewStory,
  showNewSharedStory,
  setShowNewSharedStory 
}: StoriesDialogHeaderProps) => {
  return (
    <DialogHeader className="p-6 pb-4">
      <div className="flex items-center justify-between">
        <DialogTitle className="text-2xl font-bold">Your Stories</DialogTitle>
        <Button
          onClick={() => setShowNewStory(true)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Story
        </Button>
      </div>
    </DialogHeader>
  );
};