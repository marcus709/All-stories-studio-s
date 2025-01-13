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
  userEditingRights: Record<string, boolean>;
  onLeave: (story: Story) => void;
  onDelete: (story: Story) => void;
}

export function StoriesGrid({ 
  stories, 
  onSelect, 
  isLoading, 
  onClose,
  isGroupAdmin,
  userEditingRights,
  onLeave,
  onDelete
}: StoriesGridProps) {
  const { toast } = useToast();

  const handleAction = async (e: React.MouseEvent, story: Story) => {
    e.stopPropagation();

    if (story.is_shared_space) {
      if (!isGroupAdmin && !userEditingRights[story.shared_group_id!]) {
        onLeave(story);
        return;
      }
    }
    
    onDelete(story);
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
            hasEditingRights={story.is_shared_space ? userEditingRights[story.shared_group_id!] : true}
          />
        ))}
      </div>
    </ScrollArea>
  );
}