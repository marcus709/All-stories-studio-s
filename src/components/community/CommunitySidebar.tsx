import { NavLink } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { MessageSquare, Users, Hash, Bookmark, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    <div className="w-64 shrink-0">
      {profile && (
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-purple-600 text-xl font-medium">
                {profile.username?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-medium">@{profile.username}</h3>
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
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-purple-50 text-purple-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-500 mb-4">Friends</h3>
        <p className="text-sm text-gray-500">
          No friends yet. Add some friends to chat!
        </p>
      </div>
    </div>
  );
};