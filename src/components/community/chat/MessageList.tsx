import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { getUserColor } from "@/utils/chatColors";

type Message = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

interface MessageListProps {
  messages: Message[];
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
    <div className="flex flex-col h-[400px] overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === session?.user?.id;
        const messageColor = getUserColor(message.sender_id);
        
        return (
          <div
            key={message.id}
            className={`flex items-start gap-3 w-full ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            {!isCurrentUser && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                {message.profiles?.avatar_url ? (
                  <AvatarImage src={message.profiles.avatar_url} />
                ) : (
                  <AvatarFallback>
                    {message.profiles?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            )}
            <div
              className={`flex flex-col ${
                isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium" style={{ color: messageColor }}>
                  {message.profiles?.username || "Unknown User"}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(message.created_at), "HH:mm")}
                </span>
              </div>
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] break-words`}
                style={{
                  backgroundColor: isCurrentUser ? messageColor : '#f3f4f6',
                  color: isCurrentUser ? 'white' : 'black'
                }}
              >
                {message.content}
              </div>
            </div>
            {isCurrentUser && (
              <Avatar className="h-8 w-8 flex-shrink-0">
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