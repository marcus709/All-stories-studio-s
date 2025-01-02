import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useGroups = () => {
  const session = useSession();

  return useQuery({
    queryKey: ["my-groups"],
    queryFn: async () => {
      const { data: memberGroups, error: memberError } = await supabase
        .from("groups")
        .select(`
          *,
          group_members!inner (
            user_id,
            role
          )
        `)
        .eq("group_members.user_id", session?.user?.id);

      if (memberError) throw memberError;

      const { data: createdGroups, error: creatorError } = await supabase
        .from("groups")
        .select(`
          *,
          group_members (
            user_id,
            role
          )
        `)
        .eq("created_by", session?.user?.id);

      if (creatorError) throw creatorError;

      const allGroups = [...(memberGroups || []), ...(createdGroups || [])];
      const uniqueGroups = Array.from(
        new Map(allGroups.map((group) => [group.id, group])).values()
      );

      return uniqueGroups;
    },
    enabled: !!session?.user?.id,
  });
};