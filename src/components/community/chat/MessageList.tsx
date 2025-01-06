import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

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

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">No messages yet</div>;
  }

  return (
    <div className="flex flex-col-reverse h-full overflow-y-auto p-4 space-y-reverse space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === session?.user?.id;
        return (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              isCurrentUser ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              {message.profiles?.avatar_url ? (
                <AvatarImage src={message.profiles.avatar_url} />
              ) : (
                <AvatarFallback>
                  {message.profiles?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div
              className={`flex flex-col ${
                isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">
                  {message.profiles?.username || "Unknown User"}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(message.created_at), "HH:mm")}
                </span>
              </div>
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
                  isCurrentUser
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};