import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useGroups = () => {
  const session = useSession();

  return useQuery({
    queryKey: ["my-groups", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data: memberGroups, error } = await supabase
        .from("group_members")
        .select(`
          group:groups (
            id,
            name,
            description,
            created_by,
            privacy
          )
        `)
        .eq("user_id", session.user.id);

      if (error) throw error;

      return memberGroups.map(mg => mg.group);
    },
    enabled: !!session?.user?.id
  });
};