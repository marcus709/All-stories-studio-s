import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivateChatHeaderProps {
  friend: {
    avatar_url?: string | null;
    username?: string | null;
  } | null;
  onBack?: () => void;
  onProfileClick?: () => void;
}

export const PrivateChatHeader = ({ friend, onBack, onProfileClick }: PrivateChatHeaderProps) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80"
        onClick={onProfileClick}
      >
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          {friend?.avatar_url ? (
            <img
              src={friend.avatar_url}
              alt={friend.username || ""}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-purple-600 text-sm font-medium">
              {friend?.username?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <span className="font-medium">@{friend?.username}</span>
      </div>
    </div>
  );
};