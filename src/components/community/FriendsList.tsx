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

  const { data: friends, isLoading, refetch } = useQuery({
    queryKey: ["friends", session?.user?.id],
    queryFn: async () => {
      try {
        console.log("Fetching friends for user:", session?.user?.id);
        if (!session?.user?.id) {
          console.log("No user session found");
          return [];
        }

        // Get friendships where user is the requester
        const { data: sentFriendships, error: sentError } = await supabase
          .from("friendships")
          .select(`
            id,
            status,
            friend:profiles!friendships_friend_id_fkey_profiles(
              id,
              username,
              avatar_url,
              bio
            )
          `)
          .eq("user_id", session.user.id)
          .eq("status", "accepted");

        if (sentError) {
          console.error("Error fetching sent friendships:", sentError);
          throw sentError;
        }
        console.log("Sent friendships:", sentFriendships);

        // Get friendships where user is the recipient
        const { data: receivedFriendships, error: receivedError } = await supabase
          .from("friendships")
          .select(`
            id,
            status,
            friend:profiles!friendships_user_id_fkey_profiles(
              id,
              username,
              avatar_url,
              bio
            )
          `)
          .eq("friend_id", session.user.id)
          .eq("status", "accepted");

        if (receivedError) {
          console.error("Error fetching received friendships:", receivedError);
          throw receivedError;
        }
        console.log("Received friendships:", receivedFriendships);

        // Combine both sets of friendships and remove duplicates
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

        // Remove duplicates based on friend.id
        const uniqueFriendships = allFriendships.reduce((acc, current) => {
          const x = acc.find(item => item.friend.id === current.friend.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, [] as FriendshipWithProfile[]);

        console.log("Final unique friendships:", uniqueFriendships);
        return uniqueFriendships;
      } catch (error) {
        console.error("Error in friends query:", error);
        setError("Unable to load friends at this time");
        toast({
          title: "Error",
          description: "Failed to load friends list. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!session?.user?.id,
  });

  // Subscribe to real-time updates for friendships
  useEffect(() => {
    if (!session?.user?.id) {
      console.log("No user session for real-time subscription");
      return;
    }

    console.log("Setting up real-time subscription for friendships");
    const channel = supabase
      .channel('friends-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'friendships',
          filter: `or(user_id.eq.${session.user.id},friend_id.eq.${session.user.id})`,
        },
        (payload) => {
          console.log("Received friendship change:", payload);
          // Invalidate both friends and friend-requests queries
          queryClient.invalidateQueries({ queryKey: ["friends"] });
          queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
          refetch();
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, refetch, queryClient]);

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