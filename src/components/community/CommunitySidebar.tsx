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
    <div className="fixed left-0 top-16 w-72 h-[calc(100vh-4rem)] border-r bg-white">
      <div className="p-8 flex flex-col h-full">
        {/* Profile Section */}
        {profile && (
          <div className="flex items-center gap-3 mb-12 px-2 mt-4">
            <div className="w-11 h-11 rounded-full bg-purple-500 flex items-center justify-center text-white overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-medium">
                  {profile.username?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="font-medium text-base text-gray-900">
                {profile.username || "Anonymous"}
              </h3>
              {profile.bio && (
                <p className="text-xs text-gray-500">{profile.bio}</p>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-3">
          {navItems.map(({ icon: Icon, label, href }) => (
            <NavLink
              key={href}
              to={href}
              end={href === "/community"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors text-gray-700 text-lg ${
                  isActive
                    ? "bg-purple-50 text-purple-600"
                    : "hover:bg-gray-50"
                }`
              }
            >
              <Icon className="h-6 w-6" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
          <AddFriendsDialog>
            <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors text-gray-700 text-lg hover:bg-gray-50">
              <UserPlus className="h-6 w-6" />
              <span className="font-medium">Add Friends</span>
            </button>
          </AddFriendsDialog>
        </nav>

        {/* Friends Section */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Friends</h3>
          <p className="text-sm text-gray-500">
            No friends yet. Add some friends to chat!
          </p>
        </div>
      </div>
    </div>
  );
};