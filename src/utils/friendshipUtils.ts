import { Profile } from "@/integrations/supabase/types/tables.types";

export interface FriendshipWithProfile {
  id: string;
  status: string;
  friend: Profile;
}

export const removeDuplicateFriends = (friendships: FriendshipWithProfile[]) => {
  console.log("Removing duplicates from:", friendships);
  const unique = friendships.reduce((acc, current) => {
    const x = acc.find(item => item.friend?.id === current.friend?.id);
    if (!x && current.friend) {
      return acc.concat([current]);
    }
    return acc;
  }, [] as FriendshipWithProfile[]);
  console.log("After removing duplicates:", unique);
  return unique;
};

export const filterAcceptedFriendships = (friendships: any[]) => {
  console.log("Filtering friendships, input:", friendships);
  const filtered = friendships
    .filter(f => {
      console.log("Checking friendship:", {
        hasProfile: !!f.friend,
        status: f.status,
        friendData: f.friend
      });
      return f.friend && f.status === "accepted";
    })
    .map(f => ({
      id: f.id,
      status: f.status,
      friend: f.friend
    }));
  console.log("Filtered result:", filtered);
  return filtered;
};