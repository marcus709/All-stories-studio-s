import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";

interface UserProfileDialogProps {
  user: Profile;
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileDialog = ({ user, isOpen, onClose }: UserProfileDialogProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleSendFriendRequest = async () => {
    if (!session?.user?.id) return;
    
    setIsSending(true);
    try {
      const { error } = await supabase
        .from("friendships")
        .insert({
          user_id: session.user.id,
          friend_id: user.id,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Friend request sent",
        description: `A friend request has been sent to ${user.username}`,
      });
      onClose();
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send friend request. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username || ""}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-purple-600 text-2xl font-medium">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium">@{user.username}</h3>
              {user.bio && <p className="text-sm text-gray-500">{user.bio}</p>}
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={handleSendFriendRequest}
            disabled={isSending}
          >
            {isSending ? "Sending request..." : "Send Friend Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};