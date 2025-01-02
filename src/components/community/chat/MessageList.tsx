import { useSession } from "@supabase/auth-helpers-react";

interface Message {
  id: string;
  content: string;
  user_id: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const session = useSession();

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="text-center text-gray-500">No messages yet</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.user_id === session?.user?.id
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.user_id === session?.user?.id
                ? "bg-purple-600 text-white"
                : "bg-white"
            }`}
          >
            <div className="text-sm font-medium mb-1">
              {message.profiles?.username || "Unknown User"}
            </div>
            <div>{message.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};