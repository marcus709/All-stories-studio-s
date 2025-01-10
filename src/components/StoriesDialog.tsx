import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus, AlertCircle, Users } from "lucide-react";
import { useStory } from "@/contexts/StoryContext";
import { useQueryClient } from "@tanstack/react-query";
import { CreateStoryForm } from "./stories/CreateStoryForm";
import { StoriesDialogHeader } from "./stories/StoriesDialogHeader";
import { StoriesGrid } from "./stories/StoriesGrid";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import { StoryButtons } from "./stories/StoryButtons";
import { useCreateStory } from "@/hooks/useCreateStory";
import { useStories } from "@/hooks/useStories";
import { supabase } from "@/integrations/supabase/client";
import { Story, CreateStoryInput } from "@/types/story";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useGroups } from "@/hooks/useGroups";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, Label } from "@/components/ui/select";

export function StoriesDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showNewStory, setShowNewStory] = React.useState(false);
  const [showNewSharedStory, setShowNewSharedStory] = useState(false);
  const [newStory, setNewStory] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const { selectedStory, setSelectedStory } = useStory();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { session } = useSessionContext();
  const { data: stories, error: storiesError, isLoading, isError } = useStories();
  const { data: groups } = useGroups();

  const createStoryMutation = useCreateStory((story: Story) => {
    const completeStory: Story = {
      ...story,
      user_id: session?.user?.id || '',
      created_at: story.created_at || null,
      updated_at: story.updated_at || null
    };
    setSelectedStory(completeStory);
    setShowNewStory(false);
    setNewStory({ title: "", description: "" });
    setSelectedGroup(null);
  });

  useEffect(() => {
    if (isOpen) {
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view and manage your stories.",
          variant: "destructive",
        });
        setIsOpen(false);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    }
  }, [isOpen, queryClient, toast, session]);

  const handleCreateStory = async () => {
    if (!newStory.title.trim()) {
      return;
    }
    
    try {
      if (!session?.user) {
        throw new Error("You must be logged in to create a story");
      }

      const storyInput: CreateStoryInput = {
        title: newStory.title,
        description: newStory.description || null,
        user_id: session.user.id,
      };

      createStoryMutation.mutate(storyInput);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create story",
        variant: "destructive",
      });
    }
  };

  const handleCreateSharedStory = async () => {
    if (!newStory.title.trim() || !selectedGroup) {
      return;
    }
    
    try {
      if (!session?.user) {
        throw new Error("You must be logged in to create a shared story");
      }

      const storyInput: CreateStoryInput = {
        title: newStory.title,
        description: newStory.description || null,
        user_id: session.user.id,
        is_shared_space: true,
        shared_group_id: selectedGroup
      };

      createStoryMutation.mutate(storyInput);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create shared story",
        variant: "destructive",
      });
    }
  };

  const handleNewStoryChange = (field: "title" | "description", value: string) => {
    setNewStory((prev) => ({ ...prev, [field]: value }));
  };

  if (!session) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access your stories
        </AlertDescription>
      </Alert>
    );
  }

  if (isError || storiesError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {storiesError instanceof Error ? storiesError.message : "Failed to load stories"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <StoriesDialogHeader onClose={() => setIsOpen(false)} />

          <div className="flex flex-col gap-4">
            <Button
              onClick={() => {
                setIsOpen(false);
                setShowNewStory(true);
              }}
              variant="outline"
              className="w-full border-dashed border-2 py-8 mb-2 hover:border-purple-500 hover:text-purple-500 group"
              disabled={isLoading || createStoryMutation.isPending}
            >
              <Plus className="mr-2 h-4 w-4 group-hover:text-purple-500" />
              Create New Story
            </Button>

            <Button
              onClick={() => {
                setIsOpen(false);
                setShowNewSharedStory(true);
              }}
              variant="outline"
              className="w-full border-dashed border-2 py-6 hover:border-blue-500 hover:text-blue-500 group"
              disabled={isLoading || createStoryMutation.isPending}
            >
              <Users className="mr-2 h-4 w-4 group-hover:text-blue-500" />
              Create Shared Story
            </Button>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <StoriesGrid
              stories={stories || []}
              onStorySelect={(story: Story) => {
                const completeStory: Story = {
                  ...story,
                  user_id: session?.user?.id || '',
                  created_at: story.created_at || null,
                  updated_at: story.updated_at || null
                };
                setSelectedStory(completeStory);
                setIsOpen(false);
              }}
              onClose={() => setIsOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewStory} onOpenChange={setShowNewStory}>
        <DialogContent className="sm:max-w-[500px]">
          <StoriesDialogHeader onClose={() => setShowNewStory(false)} />

          <CreateStoryForm
            newStory={newStory}
            onClose={() => {
              setShowNewStory(false);
              setNewStory({ title: "", description: "" });
            }}
            onChange={handleNewStoryChange}
            onSubmit={handleCreateStory}
            isLoading={createStoryMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showNewSharedStory} onOpenChange={setShowNewSharedStory}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Shared Story</DialogTitle>
            <DialogDescription>
              Create a story that can be edited by all members of a group
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <CreateStoryForm
              newStory={newStory}
              onClose={() => {
                setShowNewSharedStory(false);
                setNewStory({ title: "", description: "" });
                setSelectedGroup(null);
              }}
              onChange={handleNewStoryChange}
              onSubmit={handleCreateSharedStory}
              isLoading={createStoryMutation.isPending}
            />

            <div className="space-y-2">
              <Label>Select Group</Label>
              <Select
                value={selectedGroup || ""}
                onValueChange={setSelectedGroup}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <StoryButtons
        selectedStory={selectedStory}
        isLoading={isLoading}
        onOpenStories={() => setIsOpen(true)}
        onNewStory={() => setShowNewStory(true)}
        createMutationPending={createStoryMutation.isPending}
      />
    </>
  );
}
