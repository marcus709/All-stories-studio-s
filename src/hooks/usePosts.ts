import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      // First get all posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          post_likes (
            id,
            user_id
          ),
          comments (
            id,
            content,
            created_at,
            user_id
          )
        `)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Then get all unique user IDs from posts and comments
      const userIds = new Set([
        ...postsData.map((post) => post.user_id),
        ...postsData.flatMap((post) => 
          post.comments.map((comment) => comment.user_id)
        ),
      ]);

      // Fetch profiles for all these users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", Array.from(userIds));

      if (profilesError) throw profilesError;

      // Create a map of user IDs to profiles for easy lookup
      const profileMap = new Map(
        profiles.map((profile) => [profile.id, profile])
      );

      // Combine the data
      const postsWithProfiles = postsData.map((post) => ({
        ...post,
        profiles: profileMap.get(post.user_id),
        comments: post.comments.map((comment) => ({
          ...comment,
          profiles: profileMap.get(comment.user_id),
        })),
      }));

      return postsWithProfiles;
    },
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    placeholderData: [], // Show empty array while loading
    refetchOnMount: false, // Don't refetch on mount
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });
};