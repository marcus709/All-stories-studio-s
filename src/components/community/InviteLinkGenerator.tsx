import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy } from "lucide-react";

interface InviteLinkGeneratorProps {
  type: "friend" | "group";
  groupId?: string;
}

export function InviteLinkGenerator({ type, groupId }: InviteLinkGeneratorProps) {
  const session = useSession();
  const { toast } = useToast();
  const [inviteLink, setInviteLink] = useState<string>("");

  const generateInviteLink = async () => {
    try {
      const { data: link, error } = await supabase
        .from("invitation_links")
        .insert({
          type,
          created_by: session?.user?.id,
          group_id: type === "group" ? groupId : null,
        })
        .select()
        .single();

      if (error) throw error;

      const baseUrl = window.location.origin;
      const newLink = `${baseUrl}/invite/${link.id}`;
      setInviteLink(newLink);
    } catch (error) {
      console.error("Error generating invite link:", error);
      toast({
        title: "Error",
        description: "Failed to generate invite link",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Success",
        description: "Invite link copied to clipboard",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {!inviteLink ? (
          <Button onClick={generateInviteLink} className="w-full">
            Generate Invite Link
          </Button>
        ) : (
          <>
            <Input value={inviteLink} readOnly className="flex-1" />
            <Button size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {inviteLink && (
        <p className="text-sm text-muted-foreground">
          This link will expire in 7 days. Anyone with this link can {type === "friend" ? "become your friend" : "join this group"}.
        </p>
      )}
    </div>
  );
}