import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

export const TrendingTopics = () => {
  const session = useSession();

  const { data: activeGroups } = useQuery({
    queryKey: ["active-groups", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data: memberGroups } = await supabase
        .from("group_members")
        .select(`
          group_id,
          groups (
            id,
            name,
            description
          )
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      return memberGroups?.map(mg => mg.groups) || [];
    },
    enabled: !!session?.user?.id
  });

  const { data: recommendedGroups } = useQuery({
    queryKey: ["recommended-groups"],
    queryFn: async () => {
      const { data: groups } = await supabase
        .from("groups")
        .select("*")
        .limit(3);
      return groups || [];
    }
  });

  const groupsToShow = activeGroups?.length ? activeGroups : recommendedGroups;

  return (
    <div className="w-72 shrink-0 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Trending Topics</h2>
        <p className="text-gray-500 text-sm text-center">
          No trending topics yet. Start posting to see what's popular!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          {activeGroups?.length ? "Your Active Groups" : "Recommended Groups"}
        </h2>
        {groupsToShow?.length ? (
          <div className="space-y-4">
            {groupsToShow.map((group: any) => (
              <div key={group.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{group.name}</h3>
                    {group.description && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center">
            No groups available. Join or create a group to get started!
          </p>
        )}
      </div>
    </div>
  );
};