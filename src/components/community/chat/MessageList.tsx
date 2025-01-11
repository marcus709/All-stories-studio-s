import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { getUserColor } from "@/utils/chatColors";
import { CharacterPreview } from "./CharacterPreview";
import { DocumentPreview } from "./DocumentPreview";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const session = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[400px]">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="flex items-center justify-center h-[400px] text-gray-500">No messages yet</div>;
  }

  if (selectedProfile) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedProfile(null)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">User Profile</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {selectedProfile.avatar_url ? (
                <AvatarImage src={selectedProfile.avatar_url} />
              ) : (
                <AvatarFallback>
                  {selectedProfile.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">@{selectedProfile.username}</h3>
              {selectedProfile.bio && (
                <p className="text-gray-600 mt-1">{selectedProfile.bio}</p>
              )}
            </div>
          </div>
          {selectedProfile.genres && selectedProfile.genres.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Favorite Genres</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProfile.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
          {selectedProfile.skills && selectedProfile.skills.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
              <Avatar 
                className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => message.profiles && handleProfileClick(message.profiles)}
              >
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
                <span 
                  className="text-sm font-medium cursor-pointer hover:underline" 
                  style={{ color: messageColor }}
                  onClick={() => message.profiles && handleProfileClick(message.profiles)}
                >
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
              <Avatar 
                className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => message.profiles && handleProfileClick(message.profiles)}
              >
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