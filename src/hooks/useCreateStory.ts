import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/types/story";

export type CreateStoryInput = Pick<Story, "title" | "description" | "user_id">;

export function useCreateStory(onSuccess?: (story: Story) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyInput: CreateStoryInput) => {
      const { data, error } = await supabase
        .from("stories")
        .insert(storyInput)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      if (onSuccess) onSuccess(data);
    },
  });
}