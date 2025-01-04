import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      console.log("Fetching posts...");
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          get_post_profiles(*),
          post_likes (*),
          comments (
            *,
            get_comment_profiles(*)
          ),
          post_tags (*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      return data || [];
    },
  });
};