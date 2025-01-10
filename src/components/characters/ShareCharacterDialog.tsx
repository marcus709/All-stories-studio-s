import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { Character } from "@/integrations/supabase/types/tables.types";

interface ShareCharacterDialogProps {
  character: Character;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareCharacterDialog({ character, isOpen, onOpenChange }: ShareCharacterDialogProps) {
  const session = useSession();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"friends" | "groups">("friends");
  const [allowEditing, setAllowEditing] = useState(false);

  const { data: friends } = useQuery({
    queryKey: ["friends", session?.user?.id],
    queryFn: async () => {
      const { data: friendships, error } = await supabase
        .from("friendships")
        .select(`
          id,
          friend:profiles!friendships_friend_id_fkey_profiles(
            id,
            username,
            avatar_url
          )
        `)
        .eq("user_id", session?.user?.id)
        .eq("status", "accepted");

      if (error) throw error;
      return friendships;
    },
    enabled: !!session?.user?.id,
  });

  const { data: groups } = useQuery({
    queryKey: ["my-groups", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select(`
          *,
          group_members!inner(user_id)
        `)
        .eq("group_members.user_id", session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleShareWithFriend = (friendId: string) => {
    onOpenChange(false);
    navigate(`/community/chat/${friendId}`, { 
      state: { 
        sharedCharacter: character,
        canEdit: allowEditing
      }
    });
  };

  const handleShareWithGroup = (group: any) => {
    onOpenChange(false);
    navigate(`/community/groups`, { 
      state: { 
        selectedGroup: group,
        sharedCharacter: character,
        canEdit: allowEditing
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Character</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between py-4 mb-2">
          <div className="flex items-center gap-2">
            <Switch
              id="editing-access"
              checked={allowEditing}
              onCheckedChange={setAllowEditing}
            />
            <label 
              htmlFor="editing-access" 
              className="text-sm text-muted-foreground"
            >
              Allow recipients to edit this character
            </label>
          </div>
          {allowEditing && (
            <span className="text-xs text-red-500">
              Recipients will be able to modify this character
            </span>
          )}
        </div>

        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "friends" | "groups")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-4">
            <div className="space-y-4">
              {friends?.map((friendship) => (
                <div key={friendship.id} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {friendship.friend?.avatar_url ? (
                        <AvatarImage src={friendship.friend.avatar_url} />
                      ) : (
                        <AvatarFallback>
                          {friendship.friend?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="font-medium">@{friendship.friend?.username}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleShareWithFriend(friendship.friend?.id || "")}
                  >
                    Share
                  </Button>
                </div>
              ))}
              {!friends?.length && (
                <p className="text-center text-muted-foreground">No friends to share with.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="mt-4">
            <div className="space-y-4">
              {groups?.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {group.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{group.name}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleShareWithGroup(group)}
                  >
                    Share
                  </Button>
                </div>
              ))}
              {!groups?.length && (
                <p className="text-center text-muted-foreground">No groups to share with.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}