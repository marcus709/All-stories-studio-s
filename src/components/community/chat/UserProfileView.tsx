import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function UserProfileView() {
  const { userId } = useParams();
  const session = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = useState<{
    username: string;
    avatar_url: string;
    bio: string;
    background_url?: string;
  } | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (userId) {
      getProfile();
      checkFriendshipStatus();
    }
  }, [userId]);

  async function getProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, bio, background_url")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function checkFriendshipStatus() {
    if (!session?.user?.id || !userId) return;

    try {
      const { data, error } = await supabase
        .from("friendships")
        .select("status")
        .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsFriend(data.status === "accepted");
        setIsPending(data.status === "pending");
      }
    } catch (error) {
      console.error("Error checking friendship status:", error);
    }
  }

  const handleAddFriend = async () => {
    if (!session?.user?.id || !userId) return;

    try {
      const { error } = await supabase
        .from("friendships")
        .insert({
          user_id: session.user.id,
          friend_id: userId,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend request sent successfully!",
      });
      setIsPending(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!profile) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="h-48 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg overflow-hidden">
          {profile.background_url && (
            <img
              src={profile.background_url}
              alt="Profile Background"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute -bottom-16 left-8">
          <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                <span className="text-3xl font-medium text-purple-600">
                  {profile.username[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20 px-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">@{profile.username}</h1>
            {profile.bio && (
              <p className="mt-2 text-gray-600">{profile.bio}</p>
            )}
          </div>
          {!isFriend && session?.user?.id !== userId && (
            <Button
              onClick={handleAddFriend}
              disabled={isPending}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {isPending ? "Request Pending" : "Add Friend"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}