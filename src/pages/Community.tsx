import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { TrendingTopics } from "@/components/community/TrendingTopics";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Community = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
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
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex gap-8">
          <CommunitySidebar />
          <CommunityFeed />
          <TrendingTopics />
        </div>
      </div>
    </div>
  );
};

export default Community;