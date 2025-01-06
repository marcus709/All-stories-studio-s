import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { useNavigate } from "react-router-dom";

interface FriendshipWithProfile {
  id: string;
  status: string;
  friend: Profile;
}

export const FriendsList = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { data: friends, refetch } = useQuery({
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

        // Filter out any null friend entries and combine both sets
        const allFriendships = [
          ...(sentFriendships || [])
            .filter(f => f.friend)
            .map(f => ({
              id: f.id,
              status: f.status,
              friend: f.friend
            })),
          ...(receivedFriendships || [])
            .filter(f => f.friend)
            .map(f => ({
              id: f.id,
              status: f.status,
              friend: f.friend
            }))
        ];

        console.log('Processed friendships:', allFriendships);
        return allFriendships as FriendshipWithProfile[];
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
      .channel('schema-db-changes')
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
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, refetch]);

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!friends || friends.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No friends yet. Add some friends to chat!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {friends.map((friendship) => (
        <button
          key={friendship.id}
          onClick={() => navigate(`/community/chat/${friendship.friend.id}`)}
          className="w-full flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50"
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