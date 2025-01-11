import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { MyGroups } from "@/components/community/MyGroups";
import { Topics } from "@/components/community/Topics";
import { SavedPosts } from "@/components/community/SavedPosts";
import { TrendingTopics } from "@/components/community/TrendingTopics";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { PrivateChat } from "@/components/community/chat/PrivateChat";
import { DailyChallengeDialog } from "@/components/community/DailyChallengeDialog";
import { UserProfileDialog } from "@/components/community/UserProfileDialog";

const Community = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && !session) {
      navigate('/');
    }
  }, [session, isLoading, navigate]);

  if (isLoading || !session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="fixed inset-0 pt-24">
        <div className="container h-full mx-auto px-4">
          <div className="flex gap-8 h-full">
            {/* Sidebar */}
            <div className="w-64 shrink-0">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-100/50 p-6 transition-all duration-300 hover:shadow-purple-200/50">
                <CommunitySidebar />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl overflow-y-auto pb-8 animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-100/50 p-6 transition-all duration-300 hover:shadow-purple-200/50">
                <Routes>
                  <Route index element={<CommunityFeed />} />
                  <Route path="groups/*" element={<MyGroups />} />
                  <Route path="topics" element={<Topics />} />
                  <Route path="saved" element={<SavedPosts />} />
                  <Route path="chat/:friendId" element={<PrivateChat />} />
                  <Route path="profile/:userId" element={<UserProfileDialog showInDialog={false} />} />
                </Routes>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="w-80 shrink-0">
              <TrendingTopics />
            </div>
          </div>
        </div>
      </div>
      <DailyChallengeDialog />
    </div>
  );
};

export default Community;