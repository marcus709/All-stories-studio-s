import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Switch } from '../ui/switch';
import { useGroups } from '@/hooks/useGroups';
import { useFriendsList } from '@/hooks/useFriendsList';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ShareDocumentDialogProps {
  document: {
    id: string;
    title: string;
    content: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareDocumentDialog = ({ 
  document, 
  open, 
  onOpenChange,
}: ShareDocumentDialogProps) => {
  const [selectedTab, setSelectedTab] = useState<"friends" | "groups">("friends");
  const [allowEditing, setAllowEditing] = useState(false);
  const { data: groups } = useGroups();
  const { friends } = useFriendsList();
  const { toast } = useToast();

  const handleShareWithFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('document_shares')
        .insert({
          document_id: document.id,
          shared_by: (await supabase.auth.getUser()).data.user?.id,
          shared_with_user: friendId,
          can_edit: allowEditing
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document shared successfully",
      });
    } catch (error) {
      console.error("Error sharing document:", error);
      toast({
        title: "Error",
        description: "Failed to share document",
        variant: "destructive",
      });
    }
  };

  const handleShareWithGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('document_shares')
        .insert({
          document_id: document.id,
          shared_by: (await supabase.auth.getUser()).data.user?.id,
          shared_with_group: groupId,
          can_edit: allowEditing
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document shared with group successfully",
      });
    } catch (error) {
      console.error("Error sharing document with group:", error);
      toast({
        title: "Error",
        description: "Failed to share document with group",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
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
              Allow editing
            </label>
          </div>
          {allowEditing && (
            <span className="text-xs text-red-500">
              Can make changes
            </span>
          )}
        </div>

        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "friends" | "groups")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="friends" className="rounded-full">Friends</TabsTrigger>
            <TabsTrigger value="groups" className="rounded-full">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-0">
            <div className="space-y-4">
              {friends?.map((friendship) => (
                <div key={friendship.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {friendship.friend?.avatar_url ? (
                        <AvatarImage src={friendship.friend.avatar_url} />
                      ) : (
                        <AvatarFallback>
                          {friendship.friend?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm font-medium">@{friendship.friend?.username}</span>
                  </div>
                  <Button
                    onClick={() => handleShareWithFriend(friendship.friend?.id || "")}
                    size="sm"
                    className="rounded-full bg-pink-500 hover:bg-pink-600"
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

          <TabsContent value="groups" className="mt-0">
            <div className="space-y-4">
              {groups?.map((group) => (
                <div key={group.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {group.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{group.name}</span>
                  </div>
                  <Button
                    onClick={() => handleShareWithGroup(group.id)}
                    size="sm"
                    className="rounded-full bg-pink-500 hover:bg-pink-600"
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