import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StoriesDialogHeader } from "./stories/StoriesDialogHeader";
import { StoriesGrid } from "./stories/StoriesGrid";
import { CreateStoryForm } from "./stories/CreateStoryForm";
import { useStory } from "@/contexts/StoryContext";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateStory } from "@/hooks/useCreateStory";
import { useStories } from "@/hooks/useStories";
import { useFriendsList } from "@/hooks/useFriendsList";
import { Checkbox } from "@/components/ui/checkbox";

export function StoriesDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showNewStory, setShowNewStory] = React.useState(false);
  const [showNewSharedStory, setShowNewSharedStory] = useState(false);
  const [newStory, setNewStory] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(true);

  const { setSelectedStory } = useStory();
  const session = useSession();
  const { toast } = useToast();
  const { createStoryMutation } = useCreateStory();
  const { data: stories = [], isLoading } = useStories();
  const { friends } = useFriendsList();

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    try {
      await createStoryMutation.mutateAsync({
        title: newStory.title,
        description: newStory.description,
        user_id: session.user.id,
        is_shared_space: !isPrivate,
        shared_group_id: !isPrivate ? selectedGroup : null,
      });

      setShowNewStory(false);
      setNewStory({ title: "", description: "" });
      setIsOpen(false);

      toast({
        title: "Success",
        description: "Story created successfully",
      });
    } catch (error) {
      console.error("Error creating story:", error);
      toast({
        title: "Error",
        description: "Failed to create story",
        variant: "destructive",
      });
    }
  };

  const handleStorySelect = async (storyId: string) => {
    const selectedStory = stories.find((s) => s.id === storyId);
    if (selectedStory) {
      setSelectedStory(selectedStory);
      setIsOpen(false);
    }
  };

  const handleDeleteStory = async (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", storyId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Story deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Error",
        description: "Failed to delete story",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <StoriesDialogHeader
          showNewStory={showNewStory}
          setShowNewStory={setShowNewStory}
          showNewSharedStory={showNewSharedStory}
          setShowNewSharedStory={setShowNewSharedStory}
        />

        {showNewStory ? (
          <CreateStoryForm
            newStory={newStory}
            setNewStory={setNewStory}
            onSubmit={handleCreateStory}
            isLoading={createStoryMutation.isPending}
            onCancel={() => setShowNewStory(false)}
          />
        ) : (
          <StoriesGrid
            stories={stories}
            isLoading={isLoading}
            onStorySelect={handleStorySelect}
            onDeleteStory={handleDeleteStory}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}