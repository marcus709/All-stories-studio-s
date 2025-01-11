import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { getUserColor } from "@/utils/chatColors";
import { CharacterPreview } from "./CharacterPreview";
import { DocumentPreview } from "./DocumentPreview";

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const session = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-[400px]">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="flex items-center justify-center h-[400px] text-gray-500">No messages yet</div>;
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => {
        const isCurrentUser = message.user_id === session?.user?.id;
        const messageColor = getUserColor(message.user_id);
        const hasCharacter = message.metadata?.type === 'character_share';
        const hasDocument = message.metadata?.type === 'document_share';
        
        return (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            {!isCurrentUser && (
              <Avatar className="h-8 w-8">
                {message.profiles?.avatar_url ? (
                  <AvatarImage src={message.profiles.avatar_url} />
                ) : (
                  <AvatarFallback>
                    {message.profiles?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            )}
            <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium" style={{ color: messageColor }}>
                  {message.profiles?.username || "Unknown User"}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(message.created_at), "HH:mm")}
                </span>
              </div>
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] space-y-3`}
                style={{
                  backgroundColor: isCurrentUser ? messageColor : '#f3f4f6',
                  color: isCurrentUser ? 'white' : 'black'
                }}
              >
                <div>{message.content}</div>
                {hasCharacter && (
                  <CharacterPreview 
                    character={message.metadata.character} 
                    isInMessage={true}
                  />
                )}
                {hasDocument && (
                  <DocumentPreview 
                    document={message.metadata.document}
                    isInMessage={true}
                  />
                )}
              </div>
            </div>
            {isCurrentUser && (
              <Avatar className="h-8 w-8">
                {message.profiles?.avatar_url ? (
                  <AvatarImage src={message.profiles.avatar_url} />
                ) : (
                  <AvatarFallback>
                    {message.profiles?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};