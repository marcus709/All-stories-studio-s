import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const { groups } = useGroups();
  const { friends } = useFriendsList();
  const [selectedTab, setSelectedTab] = useState<"friends" | "groups">("friends");

  const handleShareWithFriend = (friendId: string) => {
    navigate(`/community/chat/${friendId}`, {
      state: { sharedDocument: document }
    });
    onOpenChange(false);
  };

  const handleShareWithGroup = (groupId: string) => {
    navigate(`/community/groups/${groupId}`, {
      state: { sharedDocument: document }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button
            variant={selectedTab === "friends" ? "default" : "outline"}
            onClick={() => setSelectedTab("friends")}
          >
            Friends
          </Button>
          <Button
            variant={selectedTab === "groups" ? "default" : "outline"}
            onClick={() => setSelectedTab("groups")}
          >
            Groups
          </Button>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          {selectedTab === "friends" ? (
            <div className="space-y-2">
              {friends?.map((friend) => (
                <Button
                  key={friend.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleShareWithFriend(friend.id)}
                >
                  {friend.username || "Unknown User"}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {groups?.map((group) => (
                <Button
                  key={group.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleShareWithGroup(group.id)}
                >
                  {group.name}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};