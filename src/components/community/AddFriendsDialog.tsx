import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profile } from "@/integrations/supabase/types";
import { useFriendsList } from "@/hooks/useFriendsList";

interface AddFriendsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFriendsDialog = ({ isOpen, onClose }: AddFriendsDialogProps) => {
  const { friends, isLoading } = useFriendsList();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  const handleUserSelect = async (user: Profile) => {
    setSelectedUser(user);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Friends</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={friend.avatar_url || ""} alt={friend.username || ""} className="h-10 w-10 rounded-full" />
                  <span className="ml-2">{friend.username}</span>
                </div>
                <Button onClick={() => handleUserSelect(friend)}>Add</Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};