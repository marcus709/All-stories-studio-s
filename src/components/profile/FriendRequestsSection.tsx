import React from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, UserX } from "lucide-react";

interface FriendRequest {
  id: string;
  status: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export function FriendRequestsSection({ onRequestHandled }: { onRequestHandled: () => void }) {
  const session = useSession();
  const { toast } = useToast();

  const { data: friendRequests } = useQuery({
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

      onRequestHandled();
    } catch (error) {
      console.error("Error handling friend request:", error);
      toast({
        title: "Error",
        description: "Failed to handle friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!friendRequests?.length) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Friend Requests</h4>
      {friendRequests.map((request) => (
        <div
          key={request.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              {request.user.avatar_url ? (
                <img
                  src={request.user.avatar_url}
                  alt={request.user.username}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-purple-600 text-lg font-medium">
                  {request.user.username?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium">@{request.user.username}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFriendRequest(request.id, 'accept')}
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFriendRequest(request.id, 'reject')}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <UserX className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}