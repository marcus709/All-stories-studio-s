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
import { useQuery } from "@tanstack/react-query";

interface StoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStorySelect: (story: Story) => void;
}

export function StoriesDialog({ open, onOpenChange, onStorySelect }: StoriesDialogProps) {
  const [showNewStory, setShowNewStory] = useState(false);
  const [showNewSharedStory, setShowNewSharedStory] = useState(false);
  const { data: stories = [], isLoading } = useStories();
  const { selectedStory } = useStory();
  const createStory = useCreateStory();

  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
  });

  // Query to check if user is admin in the group
  const { data: isGroupAdmin } = useQuery({
    queryKey: ["groupRole", selectedStory?.shared_group_id],
    queryFn: async () => {
      if (!selectedStory?.shared_group_id) return false;
      
      const { data: memberData } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", selectedStory.shared_group_id)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .single();

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
          />
        )}
      </DialogContent>
    </Dialog>
  );
}