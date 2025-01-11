import { ArrowLeft, MoreHorizontal, Search, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/integrations/supabase/types/tables.types";

interface UserProfileViewProps {
  user: Profile;
  onBack: () => void;
}

type ActivityTab = "followers" | "replies" | "highlights";

interface UserActivity {
  followers_count: number;
  replies_count: number;
  highlights_count: number;
}

export const UserProfileView = ({ user, onBack }: UserProfileViewProps) => {
  const [activeTab, setActiveTab] = useState<ActivityTab>("followers");
  const [activity, setActivity] = useState<UserActivity | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      // First get the followers count
      const { count: followersCount } = await supabase
        .from('friendships')
        .select('*', { count: true })
        .eq('friend_id', user.id)
        .eq('status', 'accepted');

      // Then get other activity counts
      const { data: activityData } = await supabase
        .rpc('get_user_activity', { user_id: user.id });

      setActivity({
        followers_count: followersCount || 0,
        replies_count: activityData?.[0]?.replies_count || 0,
        highlights_count: activityData?.[0]?.highlights_count || 0
      });
    };

    fetchActivity();
  }, [user.id]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      let query;

      switch (activeTab) {
        case "followers":
          query = supabase
            .from("friendships")
            .select("profiles!friendships_friend_id_fkey_profiles(*)")
            .eq("friend_id", user.id)
            .eq("status", "accepted");
          break;
        case "replies":
          query = supabase
            .from("comments")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          break;
        case "highlights":
          query = supabase
            .from("saved_posts")
            .select("posts(*)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (!error && data) {
        if (activeTab === "highlights") {
          setPosts(data.map((item: any) => item.posts));
        } else if (activeTab === "followers") {
          setPosts(data.map((item: any) => item.profiles));
        } else {
          setPosts(data);
        }
      }
      setLoading(false);
    };

    fetchContent();
  }, [activeTab, user.id]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold text-xl">{user.username}</h2>
          <p className="text-sm text-gray-500">{user.bio || ''}</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 bg-purple-100"></div>
        <div className="absolute left-4 bottom-[-64px]">
          <div className="h-32 w-32 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username || ""}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-purple-600 text-4xl font-medium">
                {user.username?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4">
          <Button variant="outline" size="sm" className="rounded-full">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button className="rounded-full bg-purple-600 hover:bg-purple-700">
            Message
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pt-20">
        <h1 className="font-bold text-xl">{user.username}</h1>
        {user.bio && <p className="text-gray-500 mt-1">{user.bio}</p>}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="font-semibold text-black">{activity?.followers_count || 0}</span> followers
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-black">{activity?.replies_count || 0}</span> replies
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-black">{activity?.highlights_count || 0}</span> highlights
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mt-4">
        <button 
          className={`flex-1 text-sm font-semibold py-4 ${
            activeTab === "followers" 
              ? "text-purple-600 border-b-2 border-purple-600" 
              : "text-gray-500 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
        <button 
          className={`flex-1 text-sm font-semibold py-4 ${
            activeTab === "replies" 
              ? "text-purple-600 border-b-2 border-purple-600" 
              : "text-gray-500 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("replies")}
        >
          Replies
        </button>
        <button 
          className={`flex-1 text-sm font-semibold py-4 ${
            activeTab === "highlights" 
              ? "text-purple-600 border-b-2 border-purple-600" 
              : "text-gray-500 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("highlights")}
        >
          Highlights
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Loading...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No {activeTab} yet
          </div>
        ) : (
          <div className="divide-y">
            {posts.map((post) => (
              <div key={post.id} className="p-4">
                <p className="text-sm text-gray-900">{post.content}</p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {new Date(post.created_at!).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};