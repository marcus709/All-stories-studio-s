import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Heart, Calendar } from "lucide-react";

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
    <div className="w-full bg-white">
      {/* Banner Image */}
      <div className="relative h-48 bg-gray-100">
        {profile.background_url ? (
          <img
            src={profile.background_url}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
      </div>

      {/* Profile Section */}
      <div className="px-4">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <Avatar className="h-32 w-32 border-4 border-white">
            <AvatarImage src={profile.avatar_url} alt={profile.username} />
            <AvatarFallback>{profile.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{profile.username}</h2>
              <p className="text-gray-500">@{profile.username.toLowerCase()}</p>
            </div>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>

          <p className="text-gray-700">{profile.bio}</p>

          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Joined October 2023</span>
          </div>

          {/* Stats */}
          <div className="flex space-x-6 border-y py-3 mt-4">
            <div className="flex items-center space-x-1">
              <span className="font-semibold">{stats.posts}</span>
              <span className="text-gray-500">Posts</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold">{stats.likes}</span>
              <span className="text-gray-500">Likes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 border-b">
        <div className="flex">
          <div className="px-4 py-2 text-sm font-medium text-purple-600 border-b-2 border-purple-600">
            Posts
          </div>
          <div className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">
            Media
          </div>
          <div className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">
            Likes
          </div>
        </div>
      </div>
    </div>
  );
}