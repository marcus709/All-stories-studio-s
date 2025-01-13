import { StoryCard } from "./StoryCard";
import { Story } from "@/types/story";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StoriesGridProps {
  stories: Story[];
  onSelect: (story: Story) => void;
  isLoading: boolean;
  onClose: () => void;
  isGroupAdmin?: boolean;
}

export function StoriesGrid({ stories, onSelect, isLoading, onClose, isGroupAdmin }: StoriesGridProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent, story: Story) => {
    e.stopPropagation();

    // If it's a shared story and user is not an admin, they can only leave
    if (story.is_shared_space && !isGroupAdmin) {
      try {
        const { error } = await supabase
          .from("group_members")
          .delete()
          .eq("group_id", story.shared_group_id)
          .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

        if (error) throw error;

        toast({
          title: "Left shared story",
          description: "You have successfully left the shared story space.",
        });

        queryClient.invalidateQueries({ queryKey: ["stories"] });
      } catch (error) {
        console.error("Error leaving shared story:", error);
        toast({
          title: "Error",
          description: "Failed to leave the shared story space.",
          variant: "destructive",
        });
      }
      return;
    }

    // Regular delete for own stories or admin of shared stories
    try {
      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", story.id);

      if (error) throw error;

      toast({
        title: "Story deleted",
        description: "The story has been successfully deleted.",
      });

      queryClient.invalidateQueries({ queryKey: ["stories"] });
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Error",
        description: "Failed to delete the story.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading stories...</p>
      </div>
    );
  }

  if (!stories.length) {
    return (
      <div className="p-6">
        <p>No stories found. Create your first story!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onClick={() => {
              onSelect(story);
              onClose();
            }}
            onDelete={(e) => handleDelete(e, story)}
            isSelected={false}
            isSharedStory={story.is_shared_space}
            isAdmin={isGroupAdmin}
          />
        ))}
      </div>
    </ScrollArea>
  );
}