import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface FriendshipWithProfile {
  id: string;
  status: string;
  friend: Profile;
}

export const FriendsList = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends", session?.user?.id],
    queryFn: async () => {
      try {
        if (!session?.user?.id) return [];

        // Get friendships where user is the requester
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
          .eq("user_id", session.user.id)
          .eq("status", "accepted");

        if (sentError) {
          console.error("Error fetching sent friendships:", sentError);
          throw sentError;
        }

        // Get friendships where user is the recipient
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
          .eq("friend_id", session.user.id)
          .eq("status", "accepted");

        if (receivedError) {
          console.error("Error fetching received friendships:", receivedError);
          throw receivedError;
        }

        // Combine both sets of friendships and filter out any null entries
        const allFriendships = [
          ...(sentFriendships || [])
            .filter(f => f.friend && f.status === "accepted")
            .map(f => ({
              id: f.id,
              status: f.status,
              friend: f.friend
            })),
          ...(receivedFriendships || [])
            .filter(f => f.friend && f.status === "accepted")
            .map(f => ({
              id: f.id,
              status: f.status,
              friend: f.friend
            }))
        ];

        // Remove duplicates if any
        const uniqueFriendships = Array.from(
          new Map(allFriendships.map(item => [item.friend.id, item])).values()
        );

        return uniqueFriendships as FriendshipWithProfile[];
      } catch (error) {
        console.error("Error in friends query:", error);
        setError("Unable to load friends at this time");
        return [];
      }
    },
    enabled: !!session?.user?.id,
  });

  // Subscribe to real-time updates for friendships
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('friends-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `or(user_id.eq.${session.user.id},friend_id.eq.${session.user.id})`,
        },
        (payload) => {
          console.log('Friendship change detected:', payload);
          // Invalidate both queries to ensure everything is up to date
          queryClient.invalidateQueries({ queryKey: ["friends", session.user.id] });
          queryClient.invalidateQueries({ queryKey: ["friend-requests", session.user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient]);

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 text-center">
        No friends yet. Add some friends to chat!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {friends.map((friendship) => (
        <button
          key={friendship.id}
          onClick={() => navigate(`/community/chat/${friendship.friend.id}`)}
          className="w-full flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50 transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            {friendship.friend.avatar_url ? (
              <img
                src={friendship.friend.avatar_url}
                alt={friendship.friend.username || ''}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-purple-600 text-sm font-medium">
                {friendship.friend.username?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <span className="text-sm font-medium truncate">
            @{friendship.friend.username}
          </span>
        </button>
      ))}
    </div>
  );
};