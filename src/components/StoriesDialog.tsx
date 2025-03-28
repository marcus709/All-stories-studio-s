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
import { useSession } from "@supabase/auth-helpers-react";
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
  const { selectedStory, setSelectedStory, refetchStories } = useStory();
  const createStory = useCreateStory();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();

  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
  });

  const { data: isGroupAdmin } = useQuery({
    queryKey: ["groupRole", selectedStory?.shared_group_id],
    queryFn: async () => {
      if (!selectedStory?.shared_group_id || !session?.user?.id) return false;
      
      const { data: memberData, error } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", selectedStory.shared_group_id)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking group role:", error);
        return false;
      }

      return memberData?.role === "admin";
    },
    enabled: !!selectedStory?.shared_group_id && !!session?.user?.id,
  });

  const { data: userEditingRights = {} } = useQuery({
    queryKey: ["userEditingRights"],
    queryFn: async () => {
      if (!session?.user?.id) return {};
      
      const { data: memberData, error } = await supabase
        .from("group_members")
        .select("group_id, editing_rights")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching editing rights:", error);
        return {};
      }

      return memberData?.reduce((acc: Record<string, boolean>, curr) => {
        acc[curr.group_id] = curr.editing_rights;
        return acc;
      }, {}) || {};
    },
    enabled: !!session?.user?.id,
  });

  const { data: userGroupMemberships = [] } = useQuery({
    queryKey: ["userGroupMemberships"],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data: memberships, error } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching group memberships:", error);
        return [];
      }

      return memberships.map(m => m.group_id);
    },
    enabled: !!session?.user?.id,
  });

  const visibleStories = stories.filter(async story => {
    const { data: { user } } = await supabase.auth.getUser();
    // Show user's own stories
    if (!story.is_shared_space || story.user_id === user?.id) {
      return true;
    }
    // For shared stories, only show if user is still a member of the group
    return story.shared_group_id && userGroupMemberships.includes(story.shared_group_id);
  });

  const handleCreateStory = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a story",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = {
        ...newStory,
        user_id: session.user.id,
      };
      const createdStory = await createStory.mutateAsync(formData);
      setShowNewStory(false);
      onStorySelect(createdStory);
    } catch (error) {
      console.error("Error creating story:", error);
      toast({
        title: "Error",
        description: "Failed to create story",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: "title" | "description", value: string) => {
    setNewStory(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLeaveStory = async (story: Story) => {
    try {
      if (!story.shared_group_id) return;

      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", story.shared_group_id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Left the shared story successfully",
      });

      if (selectedStory?.id === story.id) {
        setSelectedStory(null);
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["stories"] }),
        queryClient.invalidateQueries({ queryKey: ["userGroupMemberships"] })
      ]);
    } catch (error) {
      console.error("Error leaving story:", error);
      toast({
        title: "Error",
        description: "Failed to leave the story",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!storyToDelete) return;

    try {
      if (storyToDelete.is_shared_space && !isGroupAdmin && !userEditingRights[storyToDelete.shared_group_id!]) {
        toast({
          title: "Permission denied",
          description: "You don't have editing rights for this shared story.",
          variant: "destructive",
        });
        return;
      }

      // Close the delete confirmation dialog immediately
      setShowDeleteAlert(false);

      // Store the story ID for later comparison
      const storyIdToDelete = storyToDelete.id;
      
      // Clear the storyToDelete state
      setStoryToDelete(null);

      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", storyIdToDelete);

      if (error) throw error;

      // Clear selection if the deleted story was selected
      if (selectedStory?.id === storyIdToDelete) {
        setSelectedStory(null);
      }

      // Invalidate queries and refetch data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["stories"] }),
        refetchStories(),
        refetch()
      ]);

      // If this was the last story, close the dialog
      if (stories.length <= 1) {
        onOpenChange(false);
      }

      // Show success message after everything is updated
      toast({
        title: "Story deleted",
        description: "The story has been permanently deleted.",
      });

    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Error",
        description: "Failed to delete the story.",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset all states when closing the dialog
      setShowNewStory(false);
      setShowNewSharedStory(false);
      setShowDeleteAlert(false);
      setStoryToDelete(null);
      setNewStory({ title: "", description: "" });
    }
    onOpenChange(newOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleCloseDialog}>
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
              userEditingRights={userEditingRights}
              onLeave={handleLeaveStory}
              onDelete={(story) => {
                setStoryToDelete(story);
                setShowDeleteAlert(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog 
        open={showDeleteAlert}
        onOpenChange={(open) => {
          if (!open) {
            setShowDeleteAlert(false);
            setStoryToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the story
              and all its associated content.
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
