import { Profile } from "@/integrations/supabase/types/tables.types";

export interface FriendshipWithProfile {
  id: string;
  status: string;
  friend: Profile;
}

export const removeDuplicateFriends = (friendships: FriendshipWithProfile[]) => {
  return friendships.reduce((acc, current) => {
    const x = acc.find(item => item.friend.id === current.friend.id);
    if (!x) {
      return acc.concat([current]);
    }
    return acc;
  }, [] as FriendshipWithProfile[]);
};

export const filterAcceptedFriendships = (friendships: any[]) => {
  return friendships
    .filter(f => f.friend && f.status === "accepted")
    .map(f => ({
      id: f.id,
      status: f.status,
      friend: f.friend
    }));
};