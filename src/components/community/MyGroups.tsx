import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { LeaveGroupDialog } from "./LeaveGroupDialog";
import { GroupSettingsDialog } from "./GroupSettingsDialog";
import { GroupCard } from "./GroupCard";
import { GroupChat } from "./GroupChat";
import { useGroups } from "@/hooks/useGroups";
import { useGroupMutations } from "@/hooks/useGroupMutations";
import { useLocation } from "react-router-dom";
import { GroupSearch } from "./GroupSearch";
import { JoinRequestsDialog } from "./JoinRequestsDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const MyGroups = () => {
  const session = useSession();
  const location = useLocation();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedChatGroup, setSelectedChatGroup] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isJoinRequestsOpen, setIsJoinRequestsOpen] = useState(false);

  const { data: groups, isLoading } = useGroups();

  // Query for searching all groups
  const { data: searchResults } = useQuery({
    queryKey: ["search-groups", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data, error } = await supabase
        .from("groups")
        .select(`
          *,
          group_members!inner (
            user_id
          )
        `)
        .ilike("name", `%${searchQuery}%`)
        .not("group_members.user_id", "eq", session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!searchQuery && !!session?.user?.id,
  });

  // Query for pending join requests count
  const { data: pendingRequestsCount } = useQuery({
    queryKey: ["pending-requests-count", session?.user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("group_join_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .eq("groups.created_by", session?.user?.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!session?.user?.id,
  });

  // Handle group selection from TrendingTopics
  useEffect(() => {
    const state = location.state as { selectedGroup?: any };
    if (state?.selectedGroup) {
      setSelectedChatGroup(state.selectedGroup);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false);
    setSelectedGroup(null);
    if (selectedChatGroup?.id === selectedGroup?.id) {
      setSelectedChatGroup(null);
    }
  };

  const { deleteGroupMutation, leaveGroupMutation } = useGroupMutations(
    handleDeleteSuccess
  );

  const handleJoinGroup = async (group: any) => {
    try {
      if (group.privacy === "public") {
        const { error } = await supabase
          .from("group_members")
          .insert({
            group_id: group.id,
            user_id: session?.user?.id,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "You have joined the group",
        });
      } else {
        // Send join request for private groups
        const { error } = await supabase
          .from("group_join_requests")
          .insert({
            group_id: group.id,
            user_id: session?.user?.id,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Join request sent",
        });
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Loading...</div>;
  }

  if (selectedChatGroup) {
    return (
      <GroupChat
        group={selectedChatGroup}
        onBack={() => setSelectedChatGroup(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Groups</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsJoinRequestsOpen(true)}
            className="relative"
          >
            Pending Requests
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-xs text-white flex items-center justify-center">
                {pendingRequestsCount}
              </span>
            )}
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
          >
            + Create Group
          </Button>
        </div>
      </div>

      <GroupSearch onSearch={setSearchQuery} />

      {searchQuery ? (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Search Results</h2>
          {searchResults?.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No groups found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults?.map((group) => (
                <div
                  key={group.id}
                  className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-2">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {group.description}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleJoinGroup(group)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {group.privacy === "public" ? "Join Group" : "Request to Join"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {groups?.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No groups yet. Create or join a group to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups?.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isCreator={group.created_by === session?.user?.id}
                  onDelete={() => {
                    setSelectedGroup(group);
                    setIsDeleteOpen(true);
                  }}
                  onLeave={() => {
                    setSelectedGroup(group);
                    setIsLeaveOpen(true);
                  }}
                  onSettings={() => {
                    setSelectedGroup(group);
                    setIsSettingsOpen(true);
                  }}
                  onClick={() => setSelectedChatGroup(group)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <CreateGroupDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <JoinRequestsDialog open={isJoinRequestsOpen} onOpenChange={setIsJoinRequestsOpen} />

      {selectedGroup && (
        <>
          <DeleteGroupDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={() => {
              if (selectedGroup) {
                deleteGroupMutation.mutate(selectedGroup.id);
              }
            }}
          />

          <LeaveGroupDialog
            isOpen={isLeaveOpen}
            onClose={() => setIsLeaveOpen(false)}
            onConfirm={() => {
              if (selectedGroup) {
                leaveGroupMutation.mutate(selectedGroup.id);
              }
            }}
          />

          <GroupSettingsDialog
            group={selectedGroup}
            isCreator={selectedGroup.created_by === session?.user?.id}
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
          />
        </>
      )}
    </div>
  );
};
