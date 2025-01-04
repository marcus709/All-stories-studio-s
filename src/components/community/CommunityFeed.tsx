import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostForm } from "./CreatePostForm";
import { PostsList } from "./PostsList";
import { usePosts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export const CommunityFeed = () => {
  const session = useSession();
  const { toast } = useToast();
  const { data: posts = [], isLoading: isPostsLoading, error: postsError } = usePosts();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          throw error;
        }

        if (!data) {
          // Create a new profile if one doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: session.user.id,
              username: session.user.email?.split("@")[0] || "user",
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating profile:", createError);
            toast({
              title: "Error",
              description: "Failed to create profile. Please try again.",
              variant: "destructive",
            });
            throw createError;
          }

          return newProfile;
        }
        
        return data;
      } catch (error) {
        console.error("Error in profile query:", error);
        return null;
      }
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

  if (isProfileLoading || isPostsLoading) {
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
      
      {postsError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load posts. Please try again later.
          </AlertDescription>
        </Alert>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">
            No posts yet. Be the first to share something with the community!
          </p>
        </div>
      ) : (
        <PostsList posts={posts} />
      )}
    </div>
  );
};