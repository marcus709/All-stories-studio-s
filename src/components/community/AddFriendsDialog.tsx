import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FriendshipWithProfile {
  id: string;
  status: string;
  friend: Profile;
}

export const AddFriendsDialog = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: friends, isError } = useQuery({
    queryKey: ["friends", session?.user?.id],
    queryFn: async () => {
      try {
        const { data: friendships, error } = await supabase
          .from("friendships")
          .select(`
            id,
            status,
            friend:profiles!friendships_friend_id_fkey(*)
          `)
          .eq("user_id", session?.user?.id)
          .eq("status", "accepted");

        if (error) {
          console.error("Error fetching friends:", error);
          throw error;
        }

        return friendships as unknown as FriendshipWithProfile[];
      } catch (error) {
        console.error("Error in friends query:", error);
        setError("Unable to load friends at this time");
        return [];
      }
    },
    enabled: !!session?.user?.id,
  });

  const isPreviewEnvironment = window.location.hostname.includes('lovableproject.com');

  if (isPreviewEnvironment) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Friends</DialogTitle>
          </DialogHeader>
          <Alert>
            <AlertDescription>
              Friend functionality is limited in preview mode.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Friends</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">Your Friends</h4>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!error && friends?.length === 0 && (
              <p className="text-sm text-gray-500">No friends yet. Start adding some!</p>
            )}
            {!error && friends && friends.length > 0 && (
              <div className="space-y-2">
                {friends.map((friendship) => {
                  const friend = friendship.friend;
                  return (
                    <div key={friend.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        {friend.avatar_url ? (
                          <img
                            src={friend.avatar_url}
                            alt={friend.username || ''}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-purple-600 text-lg font-medium">
                            {friend.username?.[0]?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">@{friend.username}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};