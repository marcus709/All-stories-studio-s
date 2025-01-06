import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { useToast } from "@/hooks/use-toast";
import { FriendListItem } from "./FriendListItem";
import { ErrorMessage } from "./ErrorMessage";
import { useFriendshipSubscription } from "@/hooks/useFriendshipSubscription";

interface FriendshipWithProfile {
  id: string;
  status: string;
  friend: Profile;
}

export const FriendsList = () => {
  const session = useSession();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  // Subscribe to friendship changes
  useFriendshipSubscription(session?.user?.id);

  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends", session?.user?.id],
    queryFn: async () => {
      try {
        // Get friendships where user is the requester
        const { data: sentFriendships, error: sentError } = await supabase
          .from("friendships")
          .select(
            `
            id,
            status,
            friend:profiles!friendships_friend_id_fkey_profiles(
              id,
              username,
              avatar_url,
              bio
            )
          `
          )
          .eq("user_id", session?.user?.id)
          .eq("status", "accepted");

        if (sentError) throw sentError;

        // Get friendships where user is the recipient
        const { data: receivedFriendships, error: receivedError } = await supabase
          .from("friendships")
          .select(
            `
            id,
            status,
            friend:profiles!friendships_user_id_fkey_profiles(
              id,
              username,
              avatar_url,
              bio
            )
          `
          )
          .eq("friend_id", session?.user?.id)
          .eq("status", "accepted");

        if (receivedError) throw receivedError;

        // Combine both sets of friendships and filter out any null entries
        const allFriendships = [
          ...(sentFriendships || [])
            .filter((f) => f.friend && f.status === "accepted")
            .map((f) => ({
              id: f.id,
              status: f.status,
              friend: f.friend,
            })),
          ...(receivedFriendships || [])
            .filter((f) => f.friend && f.status === "accepted")
            .map((f) => ({
              id: f.id,
              status: f.status,
              friend: f.friend,
            })),
        ];

        // Remove duplicates if any
        const uniqueFriendships = Array.from(
          new Map(allFriendships.map((item) => [item.friend.id, item])).values()
        );

        return uniqueFriendships as FriendshipWithProfile[];
      } catch (error) {
        console.error("Error in friends query:", error);
        setError("Unable to load friends at this time");
        toast({
          title: "Error",
          description: "Failed to load friends. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!session?.user?.id,
  });

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!friends?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No friends yet. Add some friends to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <FriendListItem key={friend.id} friend={friend} />
      ))}
    </div>
  );
};