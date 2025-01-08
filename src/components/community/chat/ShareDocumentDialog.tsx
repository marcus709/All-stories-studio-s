import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGroups } from "@/hooks/useGroups";
import { useFriendsList } from "@/hooks/useFriendsList";

interface ShareDocumentDialogProps {
  document: {
    id: string;
    title: string;
    content: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareDocumentDialog = ({ document, open, onOpenChange }: ShareDocumentDialogProps) => {
  const navigate = useNavigate();
  const { data: groups } = useGroups();
  const { friends } = useFriendsList();
  const [selectedTab, setSelectedTab] = useState<"friends" | "groups">("friends");

  const handleShareWithFriend = (friendId: string) => {
    navigate(`/community/chat/${friendId}`, {
      state: { sharedDocument: document }
    });
    onOpenChange(false);
  };

  const handleShareWithGroup = (group: any) => {
    navigate(`/community/groups`, { 
      state: { 
        selectedGroup: group,
        sharedDocument: document 
      }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>

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
};