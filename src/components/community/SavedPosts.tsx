import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "./Post";

export const SavedPosts = () => {
  const session = useSession();

  const { data: savedPosts } = useQuery({
    queryKey: ["saved-posts"],
    queryFn: async () => {
      const { data: savedPostsData, error: savedPostsError } = await supabase
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", session?.user?.id);

      if (savedPostsError) throw savedPostsError;

      if (!savedPostsData?.length) return [];

      const postIds = savedPostsData.map((sp) => sp.post_id);

      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id (username, avatar_url),
          post_likes (id, user_id),
          comments (id),
          post_tags (tag)
        `)
        .in("id", postIds)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      return posts;
    },
    enabled: !!session?.user?.id,
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