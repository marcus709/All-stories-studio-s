import { NavLink } from "react-router-dom";
import { Home, Users, Hash, Bookmark, Settings } from "lucide-react";

const navItems = [
  { icon: Home, label: "Feed", href: "/community" },
  { icon: Users, label: "Groups", href: "/community/groups" },
  { icon: Hash, label: "Topics", href: "/community/topics" },
  { icon: Bookmark, label: "Saved", href: "/community/saved" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const CommunitySidebar = () => {
  return (
    <div className="w-64 shrink-0">
      <nav className="space-y-1">
        {navItems.map(({ icon: Icon, label, href }) => (
          <NavLink
            key={href}
            to={href}
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
    </div>
  );
};