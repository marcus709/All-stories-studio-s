import { ArrowLeft, MoreHorizontal, Search, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/integrations/supabase/types/tables.types";

interface UserProfileViewProps {
  user: Profile;
  onBack: () => void;
}

export const UserProfileView = ({ user, onBack }: UserProfileViewProps) => {
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
          <p className="text-sm text-gray-500">{user.bio ? `${user.posts_count || 0} posts` : ''}</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 bg-purple-100"></div>
        <div className="absolute left-4 -bottom-16">
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
            <span className="font-semibold text-black">0</span> followers
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mt-4">
        <button className="flex-1 text-sm font-semibold text-purple-600 border-b-2 border-purple-600 py-4">
          Posts
        </button>
        <button className="flex-1 text-sm font-semibold text-gray-500 hover:bg-gray-50 py-4">
          Replies
        </button>
        <button className="flex-1 text-sm font-semibold text-gray-500 hover:bg-gray-50 py-4">
          Highlights
        </button>
        <button className="flex-1 text-sm font-semibold text-gray-500 hover:bg-gray-50 py-4">
          Media
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 text-center text-gray-500">
          No posts yet
        </div>
      </div>
    </div>
  );
};