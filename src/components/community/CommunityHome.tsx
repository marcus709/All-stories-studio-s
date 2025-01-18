import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const CommunityHome = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate('/');
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the community.",
        variant: "destructive",
      });
    }
  }, [session, navigate, toast]);

  if (!session) return null;

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Community</h1>
        <p className="text-gray-600">Connect, share, and grow with fellow writers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Featured Communities</h2>
          <div className="space-y-4">
            {/* Featured communities will be added here */}
            <p className="text-gray-500">Coming soon...</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Popular Right Now</h2>
          <div className="space-y-4">
            {/* Popular content will be added here */}
            <p className="text-gray-500">Coming soon...</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Recent activity will be added here */}
          <p className="text-gray-500">No recent activity to show.</p>
        </div>
      </div>
    </div>
  );
};