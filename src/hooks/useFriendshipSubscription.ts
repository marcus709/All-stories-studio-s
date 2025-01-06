import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFriendshipSubscription = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("friendship-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendships",
          filter: `or(user_id.eq.${userId},friend_id.eq.${userId})`,
        },
        (payload) => {
          console.log("Friendship change detected:", payload);
          // Invalidate both queries to ensure everything is up to date
          queryClient.invalidateQueries({ queryKey: ["friends", userId] });
          queryClient.invalidateQueries({ queryKey: ["friend-requests", userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};