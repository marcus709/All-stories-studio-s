import { Profile } from "@/integrations/supabase/types/tables.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FriendListItemProps {
  friend: {
    id: string;
    status: string;
    friend: Profile;
  };
}

export const FriendListItem = ({ friend }: FriendListItemProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={friend.friend.avatar_url || undefined} />
          <AvatarFallback>
            {friend.friend.username?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">@{friend.friend.username}</p>
          {friend.friend.bio && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {friend.friend.bio}
            </p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/messages/${friend.friend.id}`)}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Message
      </Button>
    </div>
  );
};