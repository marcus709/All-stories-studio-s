import { useEffect, useState } from "react";
import { useFriendsList } from "@/hooks/useFriendsList";
import { Profile } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const FriendsList = () => {
  const { friends, isLoading } = useFriendsList();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  if (isLoading) {
    return <div>Loading friends...</div>;
  }

  return (
    <div className="space-y-4">
      {friends.map((friendship) => {
        const friend: Profile = {
          id: friendship.friend.id,
          username: friendship.friend.username,
          avatar_url: friendship.friend.avatar_url,
          bio: friendship.friend.bio,
          genres: friendship.friend.genres || [],
          skills: friendship.friend.skills || [],
          pinned_work: {
            title: friendship.friend.pinned_work?.title || "",
            content: friendship.friend.pinned_work?.content || "",
            link: friendship.friend.pinned_work?.link || "",
          },
          social_links: {
            website: friendship.friend.social_links?.website || "",
            twitter: friendship.friend.social_links?.twitter || "",
            instagram: friendship.friend.social_links?.instagram || "",
            newsletter: friendship.friend.social_links?.newsletter || "",
          },
        };

        return (
          <div key={friend.id} className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              {friend.avatar_url ? (
                <AvatarImage src={friend.avatar_url} />
              ) : (
                <AvatarFallback>{friend.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">@{friend.username}</h3>
              {friend.bio && <p className="text-sm text-gray-500">{friend.bio}</p>}
            </div>
            <Button onClick={() => setSelectedUser(friend)}>View Profile</Button>
          </div>
        );
      })}
    </div>
  );
};
