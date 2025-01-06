import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { AddFriendsDialog } from "../community/AddFriendsDialog";
import { FriendRequestsSection } from "./FriendRequestsSection";
import { CurrentFriendsSection } from "./CurrentFriendsSection";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Friend {
  id: string;
  status: string;
  friend: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export function FriendsManagement() {
  const { toast } = useToast();
  const [selectedFriend, setSelectedFriend] = React.useState<Friend | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const queryClient = useQueryClient();

  const handleUnfriend = async (friend: Friend) => {
    setSelectedFriend(friend);
    setShowConfirmDialog(true);
  };

  const confirmUnfriend = async () => {
    if (!selectedFriend) return;

    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", selectedFriend.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Unfriended ${selectedFriend.friend.username}`,
      });

      // Invalidate both friends and friend requests queries
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    } catch (error) {
      console.error("Error unfriending:", error);
      toast({
        title: "Error",
        description: "Failed to unfriend. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowConfirmDialog(false);
      setSelectedFriend(null);
    }
  };

  const handleRequestChange = () => {
    // Invalidate both friends and friend requests queries
    queryClient.invalidateQueries({ queryKey: ["friends"] });
    queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Friends List</h3>
        <AddFriendsDialog>
          <Button variant="outline" size="sm">
            Add Friends
          </Button>
        </AddFriendsDialog>
      </div>

      <FriendRequestsSection onRequestHandled={handleRequestChange} />

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Current Friends</h4>
        <CurrentFriendsSection onUnfriend={handleUnfriend} />
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Unfriend</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unfriend @{selectedFriend?.friend.username}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnfriend}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}