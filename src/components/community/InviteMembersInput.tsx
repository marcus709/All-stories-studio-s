import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";

interface InviteMembersInputProps {
  groupId: string;
  onInvite?: () => void;
}

export const InviteMembersInput = ({ groupId, onInvite }: InviteMembersInputProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Query for searching users
  const { data: searchResults } = useQuery({
    queryKey: ["search-users", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .ilike("username", `%${searchQuery}%`)
        .limit(5);

      if (error) {
        console.error("Error searching users:", error);
        return [];
      }

      // Filter out users who are already members or invited
      const { data: existingMembers } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", groupId);

      const { data: pendingInvites } = await supabase
        .from("group_join_requests")
        .select("user_id")
        .eq("group_id", groupId)
        .eq("invitation_status", "pending");

      const existingMemberIds = new Set(existingMembers?.map(m => m.user_id) || []);
      const pendingInviteIds = new Set(pendingInvites?.map(i => i.user_id) || []);

      return data.filter(user => 
        !existingMemberIds.has(user.id) && 
        !pendingInviteIds.has(user.id)
      );
    },
    enabled: searchQuery.length > 0,
  });

  const handleInvite = async (userId: string, username: string) => {
    setIsLoading(true);
    try {
      // Check if already invited
      const { data: existingInvite } = await supabase
        .from("group_join_requests")
        .select()
        .eq("group_id", groupId)
        .eq("user_id", userId)
        .eq("invitation_status", "pending")
        .maybeSingle();

      if (existingInvite) {
        toast({
          title: "Already invited",
          description: "This user has already been invited to the group",
          variant: "destructive",
        });
        return;
      }

      // Create invitation
      const { error: inviteError } = await supabase
        .from("group_join_requests")
        .insert({
          group_id: groupId,
          user_id: userId,
          invitation_status: "pending",
          invited_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (inviteError) throw inviteError;

      toast({
        title: "Success",
        description: `Invitation sent to ${username}`,
      });
      
      setSearchQuery("");
      onInvite?.();
    } catch (error) {
      console.error("Error inviting member:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder="Search users by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {searchQuery && searchResults && searchResults.length > 0 && (
        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-4 space-y-2">
            {searchResults.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {user.avatar_url ? (
                      <AvatarImage src={user.avatar_url} />
                    ) : (
                      <AvatarFallback>
                        {user.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleInvite(user.id, user.username || "")}
                  disabled={isLoading}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Invite
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {searchQuery && searchResults && searchResults.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-2">
          No users found
        </div>
      )}
    </div>
  );
};