import { MessageSquare, Users, Hash, Bookmark, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CommunitySidebar() {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return profile;
    },
  });

  const navigationItems = [
    { icon: MessageSquare, label: "Feed", path: "/community" },
    { icon: Users, label: "My Groups", path: "/community/groups" },
    { icon: Hash, label: "Topics", path: "/community/topics" },
    { icon: Bookmark, label: "Saved", path: "/community/saved" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-72 p-6 flex flex-col h-screen">
      {/* User Profile */}
      <div className="flex items-center gap-3 mb-8">
        <Avatar className="w-10 h-10 bg-purple-500">
          <span className="text-lg font-medium text-white">
            {profile?.username?.[0]?.toUpperCase() || 'U'}
          </span>
        </Avatar>
        <div>
          <p className="font-medium">@{profile?.username || 'user'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Friends Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Friends</h3>
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Users className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          No friends yet. Add some friends to chat!
        </p>
      </div>
    </div>
  );
}