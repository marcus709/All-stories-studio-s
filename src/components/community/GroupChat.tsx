import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useLocation } from "react-router-dom";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";
import { GroupHeader } from "./chat/GroupHeader";
import { supabase } from "@/integrations/supabase/client";
import { Character } from "@/integrations/supabase/types/tables.types";
import { CharacterPreview } from "./chat/CharacterPreview";
import { useGroupMessages } from "./chat/hooks/useGroupMessages";
import { useGroupMembership } from "./chat/hooks/useGroupMembership";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupChatProps {
  group: any;
  onBack: () => void;
}

export const GroupChat = ({ group, onBack }: GroupChatProps) => {
  const session = useSession();
  const location = useLocation();
  const [draftMessage, setDraftMessage] = useState("");
  const [sharedCharacter, setSharedCharacter] = useState<Character | undefined>(
    location.state?.sharedCharacter
  );
  const { messages, isLoading } = useGroupMessages(group.id);
  const { isMember, isLoading: membershipLoading } = useGroupMembership(group.id);

  useEffect(() => {
    if (sharedCharacter) {
      setDraftMessage("I'd like to share a character with the group:");
    }
  }, [sharedCharacter]);

  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id || !isMember) return;
    
    try {
      let messageData: any = {
        content,
        group_id: group.id,
        user_id: session.user.id,
      };

      if (sharedCharacter) {
        messageData.metadata = {
          type: 'character_share',
          character: sharedCharacter
        };
      }

      const { error } = await supabase
        .from("group_messages")
        .insert(messageData);

      if (error) throw error;

      if (sharedCharacter) {
        const { error: shareError } = await supabase
          .from("character_shares")
          .insert({
            character_id: sharedCharacter.id,
            shared_by: session.user.id,
            shared_with_group: group.id
          });

        if (shareError) throw shareError;
        
        // Clear the shared character after sending
        setSharedCharacter(undefined);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleRemoveCharacter = () => {
    setSharedCharacter(undefined);
    setDraftMessage("");
  };

  if (membershipLoading) {
    return <div>Loading...</div>;
  }

  if (!isMember) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="mb-4">
          ← Back
        </button>
        <div className="text-center py-8">
          <p>You are not a member of this group.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <GroupHeader groupName={group.name} onBack={onBack} />
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      {sharedCharacter && (
        <div className="p-4 border-t border-gray-100 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleRemoveCharacter}
          >
            <X className="h-4 w-4" />
          </Button>
          <CharacterPreview character={sharedCharacter} />
        </div>
      )}
      <MessageInput 
        onSendMessage={handleSendMessage} 
        initialValue={draftMessage}
      />
    </div>
  );
};