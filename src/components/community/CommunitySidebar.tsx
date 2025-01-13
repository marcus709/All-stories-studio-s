import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { MessageSquare, Users, Hash, Bookmark, Settings, UserPlus, PenLine, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddFriendsDialog } from "./AddFriendsDialog";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { capitalize } from "lodash";
import { FriendRequestsList } from "./FriendRequestsList";
import { FriendsList } from "./FriendsList";
import { DailyChallengeDialog } from "./DailyChallengeDialog";
import { GoalsDialog } from "./GoalsDialog";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: MessageSquare, label: "Feed", href: "/community" },
  { icon: Users, label: "My Groups", href: "/community/groups" },
  { icon: Hash, label: "Topics", href: "/community/topics" },
  { icon: Bookmark, label: "Saved", href: "/community/saved" },
  { icon: Settings, label: "Settings", href: "/profile/settings" },
];

export const CommunitySidebar = () => {
  const session = useSession();
  const { plan } = useSubscription();
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  const [showGoalsDialog, setShowGoalsDialog] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(false);
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session?.user?.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error("Error in profile query:", error);
        return null;
      }
    },
    enabled: !!session?.user?.id,
  });

  const { data: friendRequests } = useQuery({
    queryKey: ["friend-requests", session?.user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("friendships")
          .select("*")
          .eq("friend_id", session?.user?.id)
          .eq("status", "pending");

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        return [];
      }
    },
    enabled: !!session?.user?.id,
  });

  const { data: dailyChallenge, isLoading: isChallengeLoading } = useQuery({
    queryKey: ["daily-challenge"],
    queryFn: async () => {
      try {
        console.log("Fetching daily challenge...");
        const today = new Date().toISOString().split("T")[0];
        console.log("Today's date:", today);
        
        const { data, error } = await supabase
          .from("daily_challenges")
          .select("*")
          .eq("active_date", today)
          .maybeSingle();

        if (error) {
          console.error("Error fetching daily challenge:", error);
          throw error;
        }
        
        console.log("Daily challenge data:", data);
        return data;
      } catch (error) {
        console.error("Error in daily challenge query:", error);
        return null;
      }
    },
  });

  const { data: latestSubmission } = useQuery({
    queryKey: ["latest-submission", session?.user?.id, dailyChallenge?.id],
    queryFn: async () => {
      if (!session?.user?.id || !dailyChallenge?.id) return null;

      try {
        const { data, error } = await supabase
          .from("challenge_submissions")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("challenge_id", dailyChallenge.id)
          .order("submitted_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching submission:", error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error("Caught error:", error);
        return null;
      }
    },
    enabled: !!session?.user?.id && !!dailyChallenge?.id,
  });

  useEffect(() => {
    if (latestSubmission?.score && !latestSubmission?.viewed) {
      setHasFeedback(true);
    } else {
      setHasFeedback(false);
    }
  }, [latestSubmission]);

  const hasPendingRequests = friendRequests && friendRequests.length > 0;

  if (!session) return null;

  // Add debug log for dailyChallenge
  console.log("Daily Challenge State:", {
    isLoading: isChallengeLoading,
    dailyChallenge,
    today: new Date().toISOString().split("T")[0]
  });

  return (
    <div className="space-y-6">
      {profile && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-transparent transition-all duration-300 hover:from-purple-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg shadow-md">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              profile.username?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-gray-900 truncate">
              {profile.username || "Anonymous"}
            </span>
            <span className="text-sm text-gray-500 truncate">
              {plan !== 'free' ? `${capitalize(plan)} Plan` : "Free Plan"}
            </span>
          </div>
        </div>
      )}

      <nav className="space-y-1">
        {navItems.map(({ icon: Icon, label, href }) => (
          <NavLink
            key={href}
            to={href}
            end={href === "/community"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-900 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-purple-50/50 hover:text-gray-900"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
        
        {dailyChallenge && (
          <button
            onClick={() => setShowChallengeDialog(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 text-gray-600 hover:bg-purple-50/50 hover:text-gray-900 relative"
          >
            <PenLine className="h-5 w-5" />
            <span>Daily Challenge</span>
            {hasFeedback && (
              <span className="absolute top-2 left-6 h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            )}
          </button>
        )}

        <button
          onClick={() => setShowGoalsDialog(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 text-gray-600 hover:bg-purple-50/50 hover:text-gray-900"
        >
          <Target className="h-5 w-5" />
          <span>Goals</span>
        </button>

        <AddFriendsDialog>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 text-gray-600 hover:bg-purple-50/50 hover:text-gray-900 relative">
            <UserPlus className="h-5 w-5" />
            <span>Add Friends</span>
            {hasPendingRequests && (
              <span className="absolute top-2 left-6 h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            )}
          </button>
        </AddFriendsDialog>
      </nav>

      <FriendRequestsList />

      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Friends</h3>
        <FriendsList />
      </div>

      {showChallengeDialog && (
        <DailyChallengeDialog 
          onOpenChange={setShowChallengeDialog} 
          latestSubmission={latestSubmission}
        />
      )}

      {showGoalsDialog && (
        <GoalsDialog onOpenChange={setShowGoalsDialog} />
      )}
    </div>
  );
};
