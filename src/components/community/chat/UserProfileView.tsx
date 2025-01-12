import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileViewProps {
  userId?: string;
  user?: {
    username: string;
    avatar_url: string;
    bio: string;
    id: string;
  };
  onClose?: () => void;
}

export function UserProfileView({ userId, user, onClose }: UserProfileViewProps) {
  const session = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = React.useState<{
    username: string;
    avatar_url: string;
    bio: string;
  } | null>(null);
  const [loadingState, setLoadingState] = React.useState<"planned" | "exact" | "estimated">("planned");

  React.useEffect(() => {
    if (user) {
      setProfile(user);
    } else if (userId) {
      getProfile();
    }
  }, [userId, user]);

  async function getProfile() {
    try {
      setLoadingState("exact");
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, bio")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingState("planned");
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.avatar_url} alt={profile.username} />
          <AvatarFallback>{profile.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{profile.username}</h2>
          <p className="text-sm text-gray-500">{profile.bio}</p>
        </div>
      </div>
      {onClose && (
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      )}
    </div>
  );
}