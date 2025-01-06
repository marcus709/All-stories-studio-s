import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "./Post";

interface SavedPost {
  post_id: string;
}

interface PostProfile {
  username: string;
  avatar_url: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  get_comment_profiles: Array<{
    username: string;
    avatar_url: string | null;
  }>;
}

interface PostData {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  get_post_profiles: PostProfile[];
  post_likes: Array<{
    id: string;
    post_id: string;
    user_id: string;
  }>;
  comments: Comment[];
  post_tags: Array<{ tag: string }>;
}

export const SavedPosts = () => {
  const session = useSession();

  const { data: savedPosts } = useQuery<PostData[]>({
    queryKey: ["saved-posts", session?.user?.id],
    queryFn: async () => {
      const { data: savedPostsData, error: savedPostsError } = await supabase
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", session?.user?.id);

      if (savedPostsError) throw savedPostsError;
      if (!savedPostsData?.length) return [];

      const postIds = savedPostsData.map((sp: SavedPost) => sp.post_id);

      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          get_post_profiles:profiles!posts_user_id_fkey(username, avatar_url),
          post_likes (*),
          comments (
            *,
            get_comment_profiles:profiles(username, avatar_url)
          ),
          post_tags (tag)
        `)
        .in("id", postIds)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      return (posts as any[]).map(post => ({
        ...post,
        get_post_profiles: Array.isArray(post.get_post_profiles) 
          ? post.get_post_profiles 
          : []
      })) as PostData[];
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });

  if (!savedPosts?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-gray-50 rounded-full p-4 mb-4">
          <Bookmark className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-600 text-center">
          No saved posts yet. Save posts to read them later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {savedPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};