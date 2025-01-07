import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TrendingTopics = () => {
  const session = useSession();
  const navigate = useNavigate();

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

      // Filter out any null groups (deleted groups)
      return memberGroups?.filter(mg => mg.groups !== null).map(mg => mg.groups) || [];
    },
    enabled: !!session?.user?.id,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 // Consider data stale after 1 minute
  });

  const { data: recommendedGroups } = useQuery({
    queryKey: ["recommended-groups"],
    queryFn: async () => {
      // First get the groups the user is already a member of
      const { data: memberGroups } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", session?.user?.id);

      const memberGroupIds = memberGroups?.map(mg => mg.group_id) || [];

      // Then get groups the user is not a member of
      const { data: groups } = await supabase
        .from("groups")
        .select("*")
        .not("id", "in", `(${memberGroupIds.length ? memberGroupIds.join(",") : "00000000-0000-0000-0000-000000000000"})`)
        .limit(3);

      return groups || [];
    },
    enabled: !!session?.user?.id,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 // Consider data stale after 1 minute
  });

  const groupsToShow = activeGroups?.length ? activeGroups : recommendedGroups;

  const handleGroupClick = (group: any) => {
    navigate("/community/groups", { state: { selectedGroup: group } });
  };

  return (
    <div className="w-72 shrink-0 space-y-8 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-100/50 p-6 transition-all duration-300 hover:shadow-purple-200/50">
        <h2 className="text-lg font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Trending Topics</h2>
        <p className="text-gray-500 text-sm text-center">
          No trending topics yet. Start posting to see what's popular!
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-100/50 p-6 transition-all duration-300 hover:shadow-purple-200/50">
        <h2 className="text-lg font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {activeGroups?.length ? "Your Active Groups" : "Recommended Groups"}
        </h2>
        {groupsToShow?.length ? (
          <div className="space-y-4">
            {groupsToShow.map((group: any) => (
              <div 
                key={group.id} 
                className="p-4 bg-gradient-to-r from-purple-50/50 to-transparent rounded-lg hover:from-purple-100/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleGroupClick(group)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    {group.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
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
