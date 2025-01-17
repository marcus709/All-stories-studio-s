import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const usePosts = () => {
  const session = useSession();
  
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      console.log("Fetching posts... User authenticated:", !!session?.user);
      
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

      console.log("Posts fetched successfully:", data?.length || 0, "posts found");
      return data || [];
    },
    enabled: !!session?.user,
  });
};