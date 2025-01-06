import React from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { UserMinus } from "lucide-react";

interface Friend {
  id: string;
  status: string;
  friend: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export function CurrentFriendsSection({ 
  onUnfriend 
}: { 
  onUnfriend: (friend: Friend) => void 
}) {
  const session = useSession();

  const { data: friends } = useQuery({
    queryKey: ["friends", session?.user?.id],
    queryFn: async () => {
      // First get friendships where user is the requester
      const { data: sentFriendships, error: sentError } = await supabase
        .from("friendships")
        .select(`
          id,
          status,
          friend:profiles!friendships_friend_id_fkey_profiles(
            id,
            username,
            avatar_url
          )
        `)
        .eq("user_id", session?.user?.id)
        .eq("status", "accepted");

      if (sentError) throw sentError;

      // Then get friendships where user is the recipient
      const { data: receivedFriendships, error: receivedError } = await supabase
        .from("friendships")
        .select(`
          id,
          status,
          friend:profiles!friendships_user_id_fkey_profiles(
            id,
            username,
            avatar_url
          )
        `)
        .eq("friend_id", session?.user?.id)
        .eq("status", "accepted");

      if (receivedError) throw receivedError;

      // Combine both sets of friendships
      return [...(sentFriendships || []), ...(receivedFriendships || [])] as Friend[];
    },
    enabled: !!session?.user?.id,
  });

  if (!friends?.length) {
    return (
      <p className="text-sm text-muted-foreground">No friends yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              {friend.friend.avatar_url ? (
                <img
                  src={friend.friend.avatar_url}
                  alt={friend.friend.username}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-purple-600 text-lg font-medium">
                  {friend.friend.username?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium">@{friend.friend.username}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUnfriend(friend)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <UserMinus className="h-4 w-4 mr-2" />
            Unfriend
          </Button>
        </div>
      ))}
    </div>
  );
}