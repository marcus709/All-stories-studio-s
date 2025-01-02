import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { MyGroups } from "@/components/community/MyGroups";
import { Topics } from "@/components/community/Topics";
import { SavedPosts } from "@/components/community/SavedPosts";
import { TrendingTopics } from "@/components/community/TrendingTopics";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
      navigate("/");
    }
  }, [session, isLoading, navigate]);

  if (isLoading || !session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="fixed inset-0 pt-24">
        <div className="container h-full mx-auto px-4">
          <div className="flex gap-8 h-full">
            <div className="w-64 shrink-0">
              <div className="bg-white rounded-lg shadow p-6">
                <CommunitySidebar />
              </div>
            </div>
            <div className="flex-1 max-w-3xl overflow-y-auto pb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <Routes>
                  <Route path="/" element={<CommunityFeed />} />
                  <Route path="/groups" element={<MyGroups />} />
                  <Route path="/topics" element={<Topics />} />
                  <Route path="/saved" element={<SavedPosts />} />
                </Routes>
              </div>
            </div>
            <div className="w-80 shrink-0">
              <TrendingTopics />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;