import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "./Post";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserProfilePage = () => {
  const { id } = useParams();
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile & { genres?: string[]; skills?: string[] } | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    if (session?.user?.id) {
      checkExistingRequest();
    }
  }, [id, session?.user?.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          get_post_profiles(*),
          post_likes (*),
          comments (
            *,
            get_comment_profiles(*)
          )
        `)
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const checkExistingRequest = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("friendships")
        .select("*")
        .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
        .or(`user_id.eq.${id},friend_id.eq.${id}`)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setExistingRequest(data);
    } catch (error) {
      console.error("Error checking friend request:", error);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!session?.user?.id) return;
    
    setIsSending(true);
    try {
      const { error } = await supabase
        .from("friendships")
        .insert({
          user_id: session.user.id,
          friend_id: id,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Friend request sent",
        description: `A friend request has been sent to ${profile?.username}`,
      });
      setExistingRequest({ status: 'pending' });
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send friend request. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getRequestStatus = () => {
    if (!existingRequest) return null;
    if (existingRequest.status === 'accepted') return 'Already friends';
    if (existingRequest.status === 'pending') {
      if (existingRequest.user_id === session?.user?.id) {
        return 'Request pending';
      } else {
        return 'Request received';
      }
    }
    return null;
  };

  const requestStatus = getRequestStatus();

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </Button>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username || ""}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-purple-600 text-4xl font-medium">
                {profile.username?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">@{profile.username}</h1>
            {profile.bio && (
              <p className="text-gray-600 mb-4">{profile.bio}</p>
            )}
            {session?.user?.id !== profile.id && (
              <Button
                onClick={handleSendFriendRequest}
                disabled={isSending || !!requestStatus}
              >
                {requestStatus || (isSending ? "Sending request..." : "Send Friend Request")}
              </Button>
            )}
          </div>
        </div>

        {profile.genres && profile.genres.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Favorite Genres</h4>
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
            <h4 className="text-sm font-medium mb-2">Skills</h4>
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

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-6">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No posts yet
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="about">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">About {profile.username}</h2>
            <p className="text-gray-600">
              {profile.bio || "No bio provided"}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};