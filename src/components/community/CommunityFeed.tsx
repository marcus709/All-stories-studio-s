import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostForm } from "./CreatePostForm";
import { PostsList } from "./PostsList";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { useQuery } from "@tanstack/react-query";
import { PaywallAlert } from "../PaywallAlert";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";

export const CommunityFeed = () => {
  const session = useSession();
  const { toast } = useToast();
  const { checkFeatureAccess } = useSubscription();
  const navigate = useNavigate();
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts();
  const [showPaywall, setShowPaywall] = useState(false);

  console.log("CommunityFeed render - Session:", !!session);
  console.log("CommunityFeed - Posts:", posts?.length);
  console.log("CommunityFeed - Loading:", postsLoading);
  console.log("CommunityFeed - Error:", postsError);

  // Check for session and redirect if not authenticated
  useEffect(() => {
    if (!session) {
      console.log("No session found, redirecting to home");
      navigate('/');
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the community.",
        variant: "destructive",
      });
    }
  }, [session, navigate, toast]);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      try {
        if (!session?.user?.id) {
          console.log("No user ID found");
          return null;
        }
        
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching profile:", fetchError);
          // If the error is not a 'not found' error, throw it
          if (fetchError.code !== 'PGRST116') {
            throw fetchError;
          }
        }

        console.log("Profile fetched:", existingProfile);
        if (existingProfile) {
          return existingProfile as Profile;
        }

        // If no profile exists, create one
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: session.user.id,
              username: session.user.email?.split("@")[0] || "user",
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          throw createError;
        }

        console.log("New profile created:", newProfile);
        return newProfile as Profile;
      } catch (error) {
        console.error("Error in profile query:", error);
        throw error;
      }
    },
    enabled: !!session?.user?.id,
    retry: 1,
  });

  useEffect(() => {
    const hasAccess = checkFeatureAccess("community_access");
    setShowPaywall(!hasAccess);
  }, [checkFeatureAccess]);

  if (!session) {
    console.log("Rendering null due to no session");
    return null; // Return null since useEffect will handle the redirect
  }

  if (showPaywall) {
    console.log("No community access");
    return (
      <div className="space-y-4">
        <PaywallAlert 
          isOpen={true} 
          onClose={() => setShowPaywall(false)} 
          feature="community features" 
          requiredPlan="creator" 
        />
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Community Preview</h2>
          <p className="mt-2 text-gray-600">
            Upgrade your account to interact with the community and access all features.
          </p>
        </div>
      </div>
    );
  }

  if (profileError) {
    console.log("Profile error:", profileError);
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error loading profile. Please try again later.</p>
      </div>
    );
  }

  if (profileLoading || postsLoading) {
    console.log("Loading state");
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {profile && (
        <CreatePostForm userId={session?.user?.id!} profile={profile} />
      )}
      <PostsList posts={posts || []} />
    </div>
  );
};