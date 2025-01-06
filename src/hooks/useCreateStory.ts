import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Story, CreateStoryInput } from "@/types/story";
import { useToast } from "@/hooks/use-toast";

export function useCreateStory(onSuccess?: (story: Story) => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyData: CreateStoryInput): Promise<Story> => {
      const { data, error } = await supabase
        .from("stories")
        .insert({
          title: storyData.title,
          description: storyData.description,
          user_id: storyData.user_id,
        })
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