import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { useNavigate } from "react-router-dom";

interface UserProfileDialogProps {
  user: Profile & { genres?: string[]; skills?: string[] };
  isOpen: boolean;
  onClose: () => void;
  showInDialog?: boolean;
}

export const UserProfileDialog = ({
  user,
  isOpen,
  onClose,
  showInDialog = true,
}: UserProfileDialogProps) => {
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);

  const checkExistingRequest = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking friend request:", error);
        throw error;
      }
      setExistingRequest(data);
    } catch (error) {
      console.error("Error checking friend request:", error);
    }
  };

  useEffect(() => {
    checkExistingRequest();
  }, [session?.user?.id, user.id]);

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

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-friend-request-email', {
        body: {
          recipientId: user.id,
          senderUsername: session.user.email?.split('@')[0] || 'someone',
        },
      });

      if (emailError) {
        console.error("Error sending email notification:", emailError);
      }

      toast({
        title: "Friend request sent",
        description: `A friend request has been sent to ${user.username}`,
      });
      setExistingRequest({ status: 'pending' });
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

  const getRequestStatus = () => {
    if (!existingRequest) return null;
    if (existingRequest.status === 'accepted') return 'Already friends';
    if (existingRequest.status === 'pending') {
      if (existingRequest.user_id === session?.user?.id) {
        return 'Request pending';
      } else {
        return 'Request received';
      }
    }
    return null;
  };

  const requestStatus = getRequestStatus();

  const profileContent = (
    <div className="space-y-6">
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

      {user.genres && user.genres.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Favorite Genres</h4>
          <div className="flex flex-wrap gap-2">
            {user.genres.map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}

      {user.skills && user.skills.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {session?.user?.id !== user.id && (
        <Button
          className="w-full"
          onClick={handleSendFriendRequest}
          disabled={isSending || !!requestStatus}
        >
          {requestStatus || (isSending ? "Sending request..." : "Send Friend Request")}
        </Button>
      )}
    </div>
  );

  if (!showInDialog) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        {profileContent}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        {profileContent}
      </DialogContent>
    </Dialog>
  );
};