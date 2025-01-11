import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfileDialog } from "../UserProfileDialog";

interface PrivateChatHeaderProps {
  friend: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  } | null;
  onBack: () => void;
}

export const PrivateChatHeader = ({ friend, onBack }: PrivateChatHeaderProps) => {
  const [showProfile, setShowProfile] = useState(false);

  if (!friend) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-4 border-b bg-white/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <button 
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-3 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Avatar className="h-9 w-9">
            {friend.avatar_url ? (
              <AvatarImage src={friend.avatar_url} alt={friend.username || ""} />
            ) : (
              <AvatarFallback>
                {friend.username?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium">@{friend.username}</span>
        </button>
      </div>

      <UserProfileDialog
        user={friend}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};