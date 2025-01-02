import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const isPreviewEnvironment = window.location.hostname.includes('lovableproject.com');

// Mock data for preview environment
const PREVIEW_POSTS = [
  {
    id: '1',
    content: 'Welcome to the preview environment! This is a sample post.',
    created_at: new Date().toISOString(),
    user_id: 'preview-user',
    profiles: {
      username: 'PreviewUser',
      avatar_url: null
    },
    post_likes: [],
    comments: [],
    post_tags: [{ tag: '#preview' }]
  }
];

export const usePosts = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      console.log("Fetching posts...");
      
      // Return mock data in preview environment
      if (isPreviewEnvironment) {
        console.log("Using preview data");
        return PREVIEW_POSTS;
      }

      try {
        const { data: posts, error } = await supabase
          .from("posts")
          .select(`
            *,
            profiles (
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
              profiles (
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
          toast({
            title: "Error",
            description: "Failed to load posts. Please try again later.",
            variant: "destructive",
          });
          return [];
        }

        if (!posts || posts.length === 0) {
          console.log("No posts found, returning empty array");
          return [];
        }

        console.log("Fetched posts:", posts);
        return posts;
      } catch (error) {
        console.error("Error in posts query:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
    },
    staleTime: 1000 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};