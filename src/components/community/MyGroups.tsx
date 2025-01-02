import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Trash2, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateGroupDialog } from "./CreateGroupDialog";

export const MyGroups = () => {
  const session = useSession();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: groups, isLoading } = useQuery({
    queryKey: ["my-groups"],
    queryFn: async () => {
      // Query for groups where user is either creator or member
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

      // Combine and deduplicate groups
      const allGroups = [...(memberGroups || []), ...(createdGroups || [])];
      const uniqueGroups = Array.from(new Map(allGroups.map(group => [group.id, group])).values());
      
      return uniqueGroups;
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
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setIsCreateOpen(true)}
        >
          + Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups?.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-medium text-lg mb-2">{group.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{group.description}</p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">
                  {group.group_members?.length || 1} member{group.group_members?.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
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

      <CreateGroupDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
};