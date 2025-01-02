import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      // First get all posts with their authors' profiles
      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          user_id,
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

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      // Get unique user IDs from posts and comments
      const userIds = new Set([
        ...posts.map((post) => post.user_id),
        ...posts.flatMap((post) =>
          post.comments.map((comment) => comment.user_id)
        ),
      ]);

      // Fetch profiles for all users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", Array.from(userIds));

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      // Create a map for quick profile lookups
      const profileMap = new Map(
        profiles.map((profile) => [profile.id, profile])
      );

      // Combine posts with profiles
      const postsWithProfiles = posts.map((post) => ({
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
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};