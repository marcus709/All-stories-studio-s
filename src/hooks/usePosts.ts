import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      console.log("Fetching posts...");
      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles!posts_user_id_fkey (
            username,
            avatar_url
          ),
          post_likes (
            id,
            user_id
          ),
          comments (
            id,
            content,
            created_at,
            user_id,
            profiles!comments_user_id_fkey (
              username,
              avatar_url
            )
          ),
          post_tags (
            tag
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      console.log("Fetched posts:", posts);
      return posts;
    },
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};