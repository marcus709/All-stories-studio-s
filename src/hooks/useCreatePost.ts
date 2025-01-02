import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCreatePost = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, userId, profile, tags }: { 
      content: string; 
      userId: string; 
      profile: any;
      tags?: string;
    }) => {
      // First create the post
      const { error: postError, data: createdPost } = await supabase
        .from("posts")
        .insert({ 
          content, 
          user_id: userId  // Ensure this matches the RLS policy
        })
        .select()
        .single();

      if (postError) {
        console.error("Error creating post:", postError);
        throw postError;
      }

      // If there are tags, add them
      if (tags && createdPost) {
        const tagArray = tags.split(",").map((tag) => tag.trim());
        const tagData = tagArray.map((tag) => ({
          post_id: createdPost.id,
          tag: tag.startsWith("#") ? tag : `#${tag}`,
        }));

        const { error: tagError } = await supabase
          .from("post_tags")
          .insert(tagData);

        if (tagError) {
          console.error("Error adding tags:", tagError);
          throw tagError;
        }
      }

      return createdPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your post has been published.",
      });
    },
    onError: (error) => {
      console.error("Error in useCreatePost:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });
};