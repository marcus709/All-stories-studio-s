import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Trash2, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const MyGroups = () => {
  const session = useSession();

  const { data: groups, isLoading } = useQuery({
    queryKey: ["my-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select(`
          *,
          group_members!inner (
            user_id
          )
        `)
        .eq("group_members.user_id", session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Groups</h1>
        <Button className="bg-purple-600 hover:bg-purple-700">
          + Create Group
        </Button>
      </div>

      <div className="grid gap-4">
        {groups?.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{group.name}</h3>
              <p className="text-sm text-gray-500">123123123</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-sm text-gray-500">1 members</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};