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
          profiles:user_id (*),
          post_likes (*),
          comments (
            *,
            profiles:user_id (*)
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