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
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <div className="space-y-6">
      {session?.user?.id && (
        <CreatePostForm userId={session.user.id} profile={profile} />
      )}
      <PostsList posts={posts} />
    </div>
  );
};