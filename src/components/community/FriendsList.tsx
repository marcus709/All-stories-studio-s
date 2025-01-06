import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FriendItem } from "./FriendItem";
import { filterAcceptedFriendships, removeDuplicateFriends } from "@/utils/friendshipUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const FriendsList = () => {
  const session = useSession();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends", session?.user?.id],
    queryFn: async () => {
      try {
        console.log("Starting friends fetch for user:", session?.user?.id);
        if (!session?.user?.id) {
          console.log("No user session found");
          return [];
        }

        // Fetch friendships where the user is the sender
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

        // Fetch friendships where the user is the receiver
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

        console.log("Sent friendships:", sentFriendships);
        console.log("Received friendships:", receivedFriendships);

        // Combine and deduplicate friendships
        const allFriendships = [
          ...(sentFriendships?.map(f => ({
            id: f.id,
            status: f.status,
            friend: f.friend
          })) || []),
          ...(receivedFriendships?.map(f => ({
            id: f.id,
            status: f.status,
            friend: f.friend
          })) || [])
        ];

        console.log("Combined friendships:", allFriendships);
        
        const uniqueFriendships = removeDuplicateFriends(allFriendships);
        console.log("Unique friendships:", uniqueFriendships);
        
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

  const filteredFriends = friends?.filter(friendship => 
    friendship.friend?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="p-2 text-sm text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>
      
      <ScrollArea className="h-[280px] pr-4">
        {filteredFriends.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center bg-gray-50 rounded-lg">
            {searchQuery ? "No friends found" : "No friends yet. Add some friends to chat!"}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFriends.map((friendship) => (
              friendship.friend && (
                <FriendItem 
                  key={friendship.id}
                  friend={friendship.friend}
                  friendshipId={friendship.id}
                />
              )
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};