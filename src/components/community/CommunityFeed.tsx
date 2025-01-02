import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostForm } from "./CreatePostForm";
import { PostsList } from "./PostsList";
import { usePosts } from "@/hooks/usePosts";

export const CommunityFeed = () => {
  const session = useSession();
  const { data: posts = [], isLoading } = usePosts();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (!session) {
    return (
      <div className="text-center py-8">
        <p>Please sign in to view and create posts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreatePostForm userId={session.user.id} profile={profile} />
      {isLoading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : (
        <PostsList posts={posts} />
      )}
    </div>
  );
};