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
  onLeave: (story: Story) => void;
  onDelete: (story: Story) => void;
}

export function StoriesGrid({ 
  stories, 
  onSelect, 
  isLoading, 
  onClose, 
  isGroupAdmin,
  onLeave,
  onDelete
}: StoriesGridProps) {
  const { toast } = useToast();

  const handleAction = async (e: React.MouseEvent, story: Story) => {
    e.stopPropagation();

    // If it's a shared story and user is not an admin, they can only leave
    if (story.is_shared_space && !isGroupAdmin) {
      onLeave(story);
      return;
    }

    // If user is admin of shared story or it's their own story, they can delete
    if ((story.is_shared_space && isGroupAdmin) || !story.is_shared_space) {
      onDelete(story);
      return;
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
            onAction={(e) => handleAction(e, story)}
            isSelected={false}
            isSharedStory={story.is_shared_space}
            isAdmin={isGroupAdmin}
          />
        ))}
      </div>
    </ScrollArea>
  );
}