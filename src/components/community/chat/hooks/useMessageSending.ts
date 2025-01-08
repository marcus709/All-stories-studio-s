import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Character } from "@/integrations/supabase/types/tables.types";

interface UseMessageSendingProps {
  friendId?: string;
  isFriend: boolean;
}

export const useMessageSending = ({ friendId, isFriend }: UseMessageSendingProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [sharedCharacter, setSharedCharacter] = useState<Character | undefined>();
  const [sharedDocument, setSharedDocument] = useState<any>(undefined);
  const [draftMessage, setDraftMessage] = useState("");

  const handleSendMessage = async (content: string) => {
    if (!isFriend) {
      toast({
        title: "Error",
        description: "You can only send messages to friends",
        variant: "destructive",
      });
      return;
    }

    try {
      let messageData: any = {
        content,
        sender_id: session?.user?.id,
        receiver_id: friendId,
      };

      if (sharedCharacter) {
        messageData.metadata = {
          type: 'character_share',
          character: sharedCharacter
        };
      } else if (sharedDocument) {
        messageData.metadata = {
          type: 'document_share',
          document: sharedDocument
        };
      }

      const { error } = await supabase
        .from("private_messages")
        .insert(messageData);

      if (error) throw error;

      if (sharedCharacter) {
        const { error: shareError } = await supabase
          .from("character_shares")
          .insert({
            character_id: sharedCharacter.id,
            shared_by: session?.user?.id,
            shared_with_user: friendId
          });

        if (shareError) throw shareError;
        
        setSharedCharacter(undefined);
      } else if (sharedDocument) {
        const { error: shareError } = await supabase
          .from("document_shares")
          .insert({
            document_id: sharedDocument.id,
            shared_by: session?.user?.id,
            shared_with_user: friendId
          });

        if (shareError) throw shareError;
        
        setSharedDocument(undefined);
      }
      
      setDraftMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return {
    sharedCharacter,
    setSharedCharacter,
    sharedDocument,
    setSharedDocument,
    draftMessage,
    setDraftMessage,
    handleSendMessage
  };
};