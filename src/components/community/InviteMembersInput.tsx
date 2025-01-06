import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, X } from "lucide-react";

interface InviteMembersInputProps {
  groupId: string;
  onInvite?: () => void;
}

export const InviteMembersInput = ({ groupId, onInvite }: InviteMembersInputProps) => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) return;
    
    setIsLoading(true);
    try {
      // First check if user exists
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", email.toLowerCase())
        .maybeSingle();

      if (!profiles?.id) {
        toast({
          title: "User not found",
          description: "Please check the username and try again",
          variant: "destructive",
        });
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from("group_members")
        .select()
        .eq("group_id", groupId)
        .eq("user_id", profiles.id)
        .maybeSingle();

      if (existingMember) {
        toast({
          title: "Already a member",
          description: "This user is already a member of the group",
          variant: "destructive",
        });
        return;
      }

      // Check if already invited
      const { data: existingInvite } = await supabase
        .from("group_join_requests")
        .select()
        .eq("group_id", groupId)
        .eq("user_id", profiles.id)
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
          user_id: profiles.id,
          invitation_status: "pending",
          invited_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (inviteError) throw inviteError;

      toast({
        title: "Invitation sent",
        description: "The user has been invited to join the group",
      });
      
      setEmail("");
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
    <div className="flex gap-2">
      <Input
        placeholder="Enter username to invite"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
      />
      <Button 
        onClick={handleInvite} 
        disabled={isLoading || !email.trim()}
        size="icon"
      >
        <UserPlus className="h-4 w-4" />
      </Button>
    </div>
  );
};