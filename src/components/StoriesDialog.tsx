import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StoriesDialogHeader } from "./stories/StoriesDialogHeader";
import { StoriesGrid } from "./stories/StoriesGrid";
import { CreateStoryForm } from "./stories/CreateStoryForm";
import { useStories } from "@/hooks/useStories";
import { useStory } from "@/contexts/StoryContext";
import { Story } from "@/types/story";
import { useCreateStory } from "@/hooks/useCreateStory";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface StoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStorySelect: (story: Story) => void;
}

export function StoriesDialog({ open, onOpenChange, onStorySelect }: StoriesDialogProps) {
  const [showNewStory, setShowNewStory] = useState(false);
  const [showNewSharedStory, setShowNewSharedStory] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const { data: stories = [], isLoading, refetch } = useStories();
  const { selectedStory, setSelectedStory } = useStory();
  const createStory = useCreateStory();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
  });

  // Query to check if user is admin in the group
  const { data: isGroupAdmin } = useQuery({
    queryKey: ["groupRole", selectedStory?.shared_group_id],
    queryFn: async () => {
      if (!selectedStory?.shared_group_id) return false;
      
      const { data: memberData, error } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", selectedStory.shared_group_id)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking group role:", error);
        return false;
      }

      return memberData?.role === "admin";
    },
    enabled: !!selectedStory?.shared_group_id,
  });

  const handleCreateStory = async () => {
    try {
      const formData = {
        ...newStory,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      };
      const createdStory = await createStory.mutateAsync(formData);
      setShowNewStory(false);
      onStorySelect(createdStory);
    } catch (error) {
      console.error("Error creating story:", error);
    }
  };

  const handleChange = (field: "title" | "description", value: string) => {
    setNewStory(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteConfirm = async () => {
    if (!storyToDelete) return;

    try {
      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", storyToDelete.id);

      if (error) throw error;

      toast({
        title: "Story deleted",
        description: "The story and all its content has been permanently deleted for all members.",
      });

      // If the deleted story was selected, clear the selection
      if (selectedStory?.id === storyToDelete.id) {
        setSelectedStory(null);
      }

      queryClient.invalidateQueries({ queryKey: ["stories"] });
      setShowDeleteAlert(false);
      setStoryToDelete(null);
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Error",
        description: "Failed to delete the story.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveStory = async (story: Story) => {
    if (!story.shared_group_id) return;

    try {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", story.shared_group_id)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      // If the left story was selected, clear the selection
      if (selectedStory?.id === story.id) {
        setSelectedStory(null);
      }

      toast({
        title: "Left story",
        description: "You have successfully left the shared story.",
      });

      // Immediately remove the story from the local cache
      queryClient.setQueryData(["stories"], (oldData: Story[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(s => s.id !== story.id);
      });

      // Then refetch to ensure everything is in sync
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    } catch (error) {
      console.error("Error leaving story:", error);
      toast({
        title: "Error",
        description: "Failed to leave the story.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
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
              newStory={newStory}
              onChange={handleChange}
              onSubmit={handleCreateStory}
              onCancel={() => setShowNewStory(false)}
              isLoading={createStory.isPending}
            />
          ) : (
            <StoriesGrid
              stories={stories}
              onSelect={onStorySelect}
              isLoading={isLoading}
              onClose={() => onOpenChange(false)}
              isGroupAdmin={isGroupAdmin}
              onLeave={handleLeaveStory}
              onDelete={(story) => {
                setStoryToDelete(story);
                setShowDeleteAlert(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the story
              and all its associated content for all members of the group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteAlert(false);
              setStoryToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Story
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}