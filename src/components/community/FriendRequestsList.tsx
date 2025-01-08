import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface FriendRequest {
  id: string;
  status: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export const FriendRequestsList = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: friendRequests, refetch: refetchRequests } = useQuery({
    queryKey: ["friend-requests", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friendships")
        .select(`
          id,
          status,
          user:profiles!friendships_user_id_fkey_profiles(
            id,
            username,
            avatar_url
          )
        `)
        .eq("friend_id", session?.user?.id)
        .eq("status", "pending");

      if (error) throw error;
      return data as FriendRequest[];
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
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'friendships',
          filter: `friend_id=eq.${session.user.id}`,
        },
        () => {
          // Refetch friend requests when any change occurs
          refetchRequests();
          // Also refetch the friends list
          queryClient.invalidateQueries({ queryKey: ["friends", session.user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, refetchRequests, queryClient]);

  const handleFriendRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        const { error } = await supabase
          .from("friendships")
          .update({ status: "accepted" })
          .eq("id", requestId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Friend request accepted",
        });
      } else {
        const { error } = await supabase
          .from("friendships")
          .delete()
          .eq("id", requestId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Friend request rejected",
        });
      }

      // Immediately refetch both friend requests and friends list
      refetchRequests();
      queryClient.invalidateQueries({ queryKey: ["friends", session?.user?.id] });
    } catch (error) {
      console.error("Error handling friend request:", error);
      toast({
        title: "Error",
        description: "Failed to handle friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!friendRequests?.length) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-sm font-medium text-gray-900">Friend Requests</h3>
      {friendRequests.map((request) => (
        <div
          key={request.id}
          className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              {request.user.avatar_url ? (
                <img
                  src={request.user.avatar_url}
                  alt={request.user.username}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-purple-600 text-sm font-medium">
                  {request.user.username?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">@{request.user.username}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFriendRequest(request.id, 'accept')}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <UserCheck className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFriendRequest(request.id, 'reject')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <UserX className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};