import { Profile } from "@/integrations/supabase/types/tables.types";
import { useNavigate } from "react-router-dom";

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
      className="w-full flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50 transition-colors"
    >
      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
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
      <span className="text-sm font-medium truncate">
        @{friend.username}
      </span>
    </button>
  );
};