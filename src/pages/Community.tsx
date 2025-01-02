import { MessageSquare, Users, Hash, Bookmark, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { CommunityPost } from "@/components/community/CommunityPost";
import { CommunityTrendingTopics } from "@/components/community/CommunityTrendingTopics";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";

export default function Community() {
  return (
    <div className="flex pt-16"> {/* Added pt-16 for header height */}
      {/* Left Sidebar */}
      <CommunitySidebar />

      {/* Main Content */}
      <main className="flex-1 border-x min-h-[calc(100vh-64px)]"> {/* Adjusted height calculation */}
        <div className="max-w-3xl mx-auto py-6 px-4">
          <CommunityFeed />
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="w-80 p-6">
        <CommunityTrendingTopics />
      </div>
    </div>
  );
}