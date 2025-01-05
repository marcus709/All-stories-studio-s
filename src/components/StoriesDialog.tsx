import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CreateStoryForm } from "./stories/CreateStoryForm";
import { StoriesDialogHeader } from "./stories/StoriesDialogHeader";
import { StoriesGrid } from "./stories/StoriesGrid";
import { ScrollArea } from "./ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { StoryButtons } from "./stories/StoryButtons";
import { Story } from "@/types/story";

export function StoriesDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showNewStory, setShowNewStory] = React.useState(false);
  const [newStory, setNewStory] = useState({ title: "", description: "" });
  const { selectedStory, setSelectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stories, error: storiesError, isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        throw new Error("User must be logged in to view stories");
      }

      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("user_id", session.data.session.user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching stories:", error);
        throw error;
      }

      return data as Story[];
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isOpen) {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    }
  }, [isOpen, queryClient]);

  const createStoryMutation = useMutation({
    mutationFn: async (story: { title: string; description: string }) => {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        throw new Error("User must be logged in to create a story");
      }

      if (!story.title.trim()) {
        throw new Error("Story title cannot be empty");
      }

      const newStory: Omit<Story, 'id' | 'created_at' | 'updated_at'> = {
        title: story.title.trim(),
        description: story.description.trim(),
        user_id: session.data.session.user.id,
      };

      const { data, error } = await supabase
        .from("stories")
        .insert(newStory)
        .select()
        .single();

      if (error) {
        console.error("Error creating story:", error);
        throw error;
      }

      return data as Story;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      setSelectedStory(data);
      toast({
        title: "Story created",
        description: "Your new story has been created successfully.",
      });
      setShowNewStory(false);
      setNewStory({ title: "", description: "" });
    },
    onError: (error) => {
      console.error("Story creation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create story",
        variant: "destructive",
      });
    },
  });

  const handleCreateStory = () => {
    if (!newStory.title.trim()) {
      toast({
        title: "Error",
        description: "Story title is required",
        variant: "destructive",
      });
      return;
    }
    createStoryMutation.mutate(newStory);
  };

  const handleNewStoryChange = (field: "title" | "description", value: string) => {
    setNewStory((prev) => ({ ...prev, [field]: value }));
  };

  if (storiesError) {
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

          <Button
            onClick={() => {
              setIsOpen(false);
              setShowNewStory(true);
            }}
            variant="outline"
            className="w-full border-dashed border-2 py-8 mb-6 hover:border-purple-500 hover:text-purple-500 group"
            disabled={isLoading || createStoryMutation.isPending}
          >
            <Plus className="mr-2 h-4 w-4 group-hover:text-purple-500" />
            Create New Story
          </Button>

          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
              </div>
            ) : (
              <StoriesGrid
                stories={stories || []}
                onStorySelect={(story) => {
                  setSelectedStory(story);
                  setIsOpen(false);
                }}
                onClose={() => setIsOpen(false)}
              />
            )}
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

      <StoryButtons
        selectedStory={selectedStory}
        isLoading={isLoading}
        onOpenStories={() => setIsOpen(true)}
        onNewStory={() => setShowNewStory(true)}
        createMutationPending={createStoryMutation.isPending}
      />
    </>
  );
