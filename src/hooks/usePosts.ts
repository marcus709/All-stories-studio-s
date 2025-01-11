import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const usePosts = (userId?: string) => {
  const session = useSession();
  
  return useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      console.log("Fetching posts... User authenticated:", !!session?.user);
      
      let query = supabase
        .from("posts")
        .select(`
          *,
          get_post_profiles(*),
          post_likes (*),
          comments (
            *,
            get_comment_profiles(*)
          )
        `)
        .order("created_at", { ascending: false });

      // If userId is provided, filter posts for that user
      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      console.log("Posts fetched successfully:", data?.length || 0, "posts found");
      return data || [];
    },
    enabled: !!session?.user,
  });
};