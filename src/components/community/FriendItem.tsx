import { Profile } from "@/integrations/supabase/types/tables.types";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

interface FriendItemProps {
  friend: Profile;
  friendshipId: string;
}

export const FriendItem = ({ friend, friendshipId }: FriendItemProps) => {
  const navigate = useNavigate();

  return (
    <button
      key={friendshipId}
      onClick={() => navigate(`/community/chat/${friend.id}`)}
      className="w-full flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 transition-colors group"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center">
          {friend.avatar_url ? (
            <img
              src={friend.avatar_url}
              alt={friend.username || ''}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-purple-600 text-sm font-medium">
              {friend.username?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <span className="text-sm font-medium truncate text-gray-700">
          {friend.username}
        </span>
      </div>
      <MessageCircle className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};