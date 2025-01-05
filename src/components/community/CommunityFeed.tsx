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

export const CommunityFeed = () => {
  const session = useSession();
  const { toast } = useToast();
  const { checkFeatureAccess } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);

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
          .single();

        if (fetchError) {
          console.error("Error fetching profile:", fetchError);
          // If the error is not a 'not found' error, throw it
          if (fetchError.code !== 'PGRST116') {
            throw fetchError;
          }
        }

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

        return newProfile as Profile;
      } catch (error) {
        console.error("Error in profile query:", error);
        throw error;
      }
    },
    enabled: !!session?.user?.id,
    retry: 1,
  });

  if (!checkFeatureAccess("community_access")) {
    return <PaywallAlert isOpen={true} onClose={() => {}} feature="community features" requiredPlan="creator" />;
  }

  if (profileError) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error loading profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!profileLoading && profile && (
        <CreatePostForm userId={session?.user?.id!} profile={profile} />
      )}
      <PostsList posts={[]} />
    </div>
  );
};