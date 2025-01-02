import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { TrendingTopics } from "@/components/community/TrendingTopics";
import { useEffect } from "react";

export const Community = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
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