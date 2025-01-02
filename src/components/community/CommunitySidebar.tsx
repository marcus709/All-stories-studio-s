import { NavLink } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { MessageSquare, Users, Hash, Bookmark, Settings, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddFriendsDialog } from "./AddFriendsDialog";

const navItems = [
  { icon: MessageSquare, label: "Feed", href: "/community" },
  { icon: Users, label: "My Groups", href: "/community/groups" },
  { icon: Hash, label: "Topics", href: "/community/topics" },
  { icon: Bookmark, label: "Saved", href: "/community/saved" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const CommunitySidebar = () => {
  const session = useSession();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <div className="space-y-6">
      {profile && (
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-lg">
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
              {profile.bio || "Curious Plan"}
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
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-purple-100 text-purple-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
        <AddFriendsDialog>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <UserPlus className="h-5 w-5" />
            <span>Add Friends</span>
          </button>
        </AddFriendsDialog>
      </nav>

      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Friends</h3>
        <p className="text-sm text-gray-500">
          No friends yet. Add some friends to chat!
        </p>
      </div>
    </div>
  );
};