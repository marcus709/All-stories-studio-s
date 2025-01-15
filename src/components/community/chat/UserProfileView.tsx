import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Heart, User } from "lucide-react";

interface UserProfileViewProps {
  userId?: string;
  user?: {
    username: string;
    avatar_url: string;
    bio: string;
    background_url?: string;
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
    background_url?: string;
  } | null>(null);
  const [stats, setStats] = React.useState({
    posts: 0,
    likes: 0,
  });

  React.useEffect(() => {
    if (user) {
      setProfile(user);
      fetchStats(user.id);
    } else if (userId) {
      getProfile();
    }
  }, [userId, user]);

  async function getProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, bio, background_url")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      if (userId) fetchStats(userId);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function fetchStats(profileId: string) {
    try {
      // Fetch posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profileId);

      // Fetch likes count
      const { count: likesCount } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profileId);

      setStats({
        posts: postsCount || 0,
        likes: likesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Background Image */}
      <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
        {profile.background_url ? (
          <img
            src={profile.background_url}
            alt="Profile background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
        )}
      </div>

      {/* Profile Info */}
      <div className="relative -mt-16 flex flex-col items-center px-4 w-full">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={profile.avatar_url} alt={profile.username} />
          <AvatarFallback>{profile.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <h2 className="text-2xl font-bold mt-4">{profile.username}</h2>
        <p className="text-gray-600 text-center mt-2 max-w-md">{profile.bio}</p>

        {/* Stats Bar */}
        <div className="flex gap-8 mt-6 p-4 bg-white rounded-lg shadow-sm border w-full max-w-md">
          <div className="flex items-center gap-2 flex-1 justify-center">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <div className="text-center">
              <p className="font-semibold">{stats.posts}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Heart className="w-5 h-5 text-gray-500" />
            <div className="text-center">
              <p className="font-semibold">{stats.likes}</p>
              <p className="text-sm text-gray-500">Likes</p>
            </div>
          </div>
        </div>

        {onClose && (
          <div className="mt-6">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}