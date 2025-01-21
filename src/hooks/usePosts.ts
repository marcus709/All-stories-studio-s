import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./use-toast";

export const usePosts = () => {
  const session = useSession();
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      console.log("Fetching posts... User authenticated:", !!session?.user);
      
      try {
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
          toast({
            title: "Error fetching posts",
            description: "Please try again later",
            variant: "destructive",
          });
          throw error;
        }

        console.log("Posts fetched successfully:", data?.length || 0, "posts found");
        return data || [];
      } catch (error) {
        console.error("Error in posts query:", error);
        toast({
          title: "Error loading posts",
          description: "Please check your connection and try again",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!session?.user,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};