import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserProfileDialog } from "../UserProfileDialog";
import { Profile } from "@/integrations/supabase/types/tables.types";

interface PrivateChatHeaderProps {
  friend: {
    id: string;
    avatar_url?: string | null;
    username: string | null;
    bio?: string | null;
    genres?: string[];
    skills?: string[];
  } | null;
  onBack?: () => void;
}

export const PrivateChatHeader = ({ friend, onBack }: PrivateChatHeaderProps) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/community");
    }
  };

  const handleProfileClick = () => {
    if (friend) {
      navigate(`/community/profile/${friend.id}`);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Button variant="ghost" size="icon" onClick={handleBack}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div
        className="flex items-center gap-3 cursor-pointer hover:opacity-80"
        onClick={handleProfileClick}
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

      {friend && showProfile && (
        <UserProfileDialog
          user={friend as Profile}
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};