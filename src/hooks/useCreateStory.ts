import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/types/story";
import { useToast } from "@/components/ui/use-toast";

interface CreateStoryInput {
  title: string;
  description: string;
}

export function useCreateStory(onSuccess?: (story: Story) => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyData: CreateStoryInput) => {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        throw new Error("User must be logged in to create a story");
      }

      if (!storyData.title.trim()) {
        throw new Error("Story title cannot be empty");
      }

      const newStoryData = {
        title: storyData.title.trim(),
        description: storyData.description.trim(),
        user_id: session.data.session.user.id,
      };

      const { data, error } = await supabase
        .from("stories")
        .insert(newStoryData)
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
      onSuccess?.(data);
      toast({
        title: "Story created",
        description: "Your new story has been created successfully.",
      });
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
}