import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { filterAcceptedFriendships } from "@/utils/friendshipUtils";

export interface Friend extends Profile {
  id: string;
  username: string | null;
}

export const useFriendsList = () => {
  const session = useSession();

  const { data: friends, isLoading, error } = useQuery({
    queryKey: ["friends", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select(`
          id,
          status,
          friend:profiles!friendships_friend_id_fkey_profiles (
            id,
            username,
            avatar_url,
            bio
          )
        `)
        .eq('status', 'accepted')
        .eq('user_id', session.user.id);

      if (friendshipsError) throw friendshipsError;
      
      return filterAcceptedFriendships(friendships || []);
    },
    enabled: !!session?.user?.id
  });

  return {
    friends: friends || [],
    isLoading,
    error
  };
};