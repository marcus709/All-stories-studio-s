import { StoryCard } from "./StoryCard";
import { Story } from "@/types/story";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface StoriesGridProps {
  stories: Story[];
  onSelect: (story: Story) => void;
  isLoading: boolean;
  onClose: () => void;
}

export const StoriesGrid = ({ stories, onSelect, isLoading, onClose }: StoriesGridProps) => {
  const { selectedStory, setSelectedStory } = useStory();
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteStoryMutation = useMutation({
    mutationFn: async (storyId: string) => {
      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", storyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      if (selectedStory?.id === storyToDelete?.id) {
        setSelectedStory(null);
      }
      toast({
        title: "Story deleted",
        description: "Your story has been deleted successfully.",
      });
      setStoryToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete story",
        variant: "destructive",
      });
      setStoryToDelete(null);
    },
  });

  const handleDelete = (story: Story, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent story selection when clicking delete
    setStoryToDelete(story);
  };

  const handleConfirmDelete = () => {
    if (storyToDelete) {
      deleteStoryMutation.mutate(storyToDelete.id);
    }
  };

  const handleStorySelect = (story: Story) => {
    onSelect(story);
    onClose();
  };

  return (
    <div className="p-6 pt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onClick={() => handleStorySelect(story)}
            onDelete={(e) => handleDelete(story, e)}
          />
        ))}
      </div>

      <AlertDialog open={!!storyToDelete} onOpenChange={() => setStoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the story
              "{storyToDelete?.title}" and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
