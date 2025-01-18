import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const CommunityHome = () => {
  const session = useSession();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session?.user?.id)
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    },
    enabled: !!session?.user?.id,
  });

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