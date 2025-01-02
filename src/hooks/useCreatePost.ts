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
      const newPostData = {
        content,
        user_id: userId,
        profiles: {
          username: profile?.username,
          avatar_url: profile?.avatar_url,
        },
        post_likes: [],
        comments: [],
        created_at: new Date().toISOString(),
      };

      // Optimistically update the UI
      queryClient.setQueryData(["posts"], (old: any) => [newPostData, ...(old || [])]);

      const { error: postError, data: createdPost } = await supabase
        .from("posts")
        .insert({ content, user_id: userId })
        .select()
        .single();

      if (postError) throw postError;

      // If there are tags, add them
      if (tags) {
        const tagArray = tags.split(",").map((tag) => tag.trim());
        const tagData = tagArray.map((tag) => ({
          post_id: createdPost.id,
          tag: tag.startsWith("#") ? tag : `#${tag}`,
        }));

        const { error: tagError } = await supabase
          .from("post_tags")
          .insert(tagData);

        if (tagError) throw tagError;
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
    onError: () => {
      // Rollback optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });
};