import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const InvitePage = () => {
  const { inviteId } = useParams();
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processInvite = async () => {
      try {
        // Get the invitation details
        const { data: invite, error: inviteError } = await supabase
          .from("invitation_links")
          .select("*")
          .eq("id", inviteId)
          .single();

        if (inviteError || !invite) throw new Error("Invalid or expired invite link");

        if (invite.used) throw new Error("This invite link has already been used");

        if (new Date(invite.expires_at) < new Date()) {
          throw new Error("This invite link has expired");
        }

        // Process based on invite type
        if (invite.type === "friend") {
          const { error: friendError } = await supabase
            .from("friendships")
            .insert({
              user_id: invite.created_by,
              friend_id: session?.user?.id,
              status: "accepted"
            });

          if (friendError) throw friendError;
        } else if (invite.type === "group") {
          const { error: memberError } = await supabase
            .from("group_members")
            .insert({
              group_id: invite.group_id,
              user_id: session?.user?.id,
              role: "member"
            });

          if (memberError) throw memberError;
        }

        // Mark invite as used
        await supabase
          .from("invitation_links")
          .update({ used: true })
          .eq("id", inviteId);

        toast({
          title: "Success",
          description: invite.type === "friend" 
            ? "You are now friends!" 
            : "You have joined the group!",
        });

        // Redirect
        navigate(invite.type === "friend" ? "/community" : "/community/groups");
      } catch (error: any) {
        console.error("Error processing invite:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to process invite",
          variant: "destructive",
        });
        navigate("/community");
      } finally {
        setIsProcessing(false);
      }
    };

    if (session?.user) {
      processInvite();
    } else {
      // If not logged in, redirect to auth with return URL
      const returnUrl = `/invite/${inviteId}`;
      navigate(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [inviteId, session?.user, navigate, toast]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Processing invite...</p>
      </div>
    );
  }

  return null;
};

export default InvitePage;
