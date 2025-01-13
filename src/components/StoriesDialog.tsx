import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StoriesDialogHeader } from "./stories/StoriesDialogHeader";
import { StoriesGrid } from "./stories/StoriesGrid";
import { CreateStoryForm } from "./stories/CreateStoryForm";
import { useStories } from "@/hooks/useStories";
import { useStory } from "@/contexts/StoryContext";
import { Story } from "@/types/story";
import { useCreateStory } from "@/hooks/useCreateStory";

interface StoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStorySelect: (story: Story) => void;
}

export function StoriesDialog({ open, onOpenChange, onStorySelect }: StoriesDialogProps) {
  const [showNewStory, setShowNewStory] = useState(false);
  const [showNewSharedStory, setShowNewSharedStory] = useState(false);
  const { data: stories = [], isLoading } = useStories();
  const createStory = useCreateStory();

  const handleCreateStory = async (formData: any) => {
    try {
      const newStory = await createStory.mutateAsync(formData);
      setShowNewStory(false);
      onStorySelect(newStory);
    } catch (error) {
      console.error("Error creating story:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <StoriesDialogHeader 
          showNewStory={showNewStory}
          setShowNewStory={setShowNewStory}
          showNewSharedStory={showNewSharedStory}
          setShowNewSharedStory={setShowNewSharedStory}
        />
        
        {showNewStory ? (
          <CreateStoryForm 
            onSubmit={handleCreateStory}
            onCancel={() => setShowNewStory(false)}
          />
        ) : (
          <StoriesGrid
            stories={stories}
            onSelect={onStorySelect}
            isLoading={isLoading}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}