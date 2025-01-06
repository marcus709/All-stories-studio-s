import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Story, CreateStoryInput } from "@/types/story";

export const useCreateStory = (onSuccess?: (story: Story) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyData: CreateStoryInput) => {
      const { data, error } = await supabase
        .from("stories")
        .insert({
          title: storyData.title,
          description: storyData.description,
          user_id: storyData.user_id,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from story creation");
      }

      // Ensure the returned data matches our Story type
      const story: Story = {
        id: data.id,
        title: data.title,
        description: data.description,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return story;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      onSuccess?.(data);
    },
  });
};