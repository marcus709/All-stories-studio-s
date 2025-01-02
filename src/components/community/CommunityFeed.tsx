import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostForm } from "./CreatePostForm";
import { PostsList } from "./PostsList";
import { usePosts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";

export const CommunityFeed = () => {
  const session = useSession();
  const { data: posts = [], isLoading: isPostsLoading } = usePosts();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <p>Please sign in to view and create posts.</p>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreatePostForm userId={session.user.id} profile={profile} />
      {isPostsLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <PostsList posts={posts} />
      )}
    </div>
  );
};