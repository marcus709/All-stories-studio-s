import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/components/community/Post";

interface ExtendedProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  genres: string[];
  skills: string[];
  created_at?: string;
  social_links?: {
    website: string | null;
    twitter: string | null;
    instagram: string | null;
  };
}

interface PostWithProfiles {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  post_likes: Array<{ id: string; user_id: string }>;
  comments: Array<{
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    profiles: {
      username: string;
      avatar_url: string | null;
    };
  }>;
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const session = useSession();
  const { toast } = useToast();
  const [requestSent, setRequestSent] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as ExtendedProfile;
    },
    enabled: !!userId,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["user-posts", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles!posts_user_id_fkey (
            username,
            avatar_url
          ),
          post_likes (
            id,
            user_id
          ),
          comments (
            id,
            content,
            user_id,
            created_at,
            profiles!comments_user_id_fkey (
              username,
              avatar_url
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PostWithProfiles[];
    },
    enabled: !!userId,
  });

  const { data: friendshipStatus } = useQuery({
    queryKey: ["friendship-status", userId],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && !!userId,
  });

  const handleSendFriendRequest = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from("friendships")
        .insert({
          user_id: session.user.id,
          friend_id: userId,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Friend request sent",
        description: `A friend request has been sent to ${profile?.username}`,
      });
      setRequestSent(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send friend request. Please try again.",
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === userId;
  const isFriend = friendshipStatus?.status === "accepted";
  const isPending = friendshipStatus?.status === "pending" || requestSent;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-lg" />
        
        <div className="px-6 pb-6">
          <div className="flex justify-between items-end -mt-12">
            <div className="flex items-end">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username || ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-purple-600 text-3xl font-medium">
                    {profile.username?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="ml-4 mb-2">
                <h1 className="text-2xl font-bold">@{profile.username}</h1>
                {profile.bio && (
                  <p className="text-gray-600 mt-1">{profile.bio}</p>
                )}
              </div>
            </div>
            
            {!isOwnProfile && (
              <Button
                onClick={handleSendFriendRequest}
                disabled={isFriend || isPending}
                className="mb-2"
              >
                {isFriend ? "Friends" : isPending ? "Request Pending" : "Add Friend"}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {profile.genres?.length || 0} genres • {profile.skills?.length || 0} skills
              </span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
          <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6 space-y-6">
          {postsLoading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts?.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet</p>
          ) : (
            posts?.map((post) => (
              <Post key={post.id} post={post} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="about" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {profile.genres && profile.genres.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Favorite Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
