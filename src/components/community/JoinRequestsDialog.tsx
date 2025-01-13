import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface JoinRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JoinRequestsDialog = ({ open, onOpenChange }: JoinRequestsDialogProps) => {
  const session = useSession();
  const { toast } = useToast();

  const { data: requests, refetch } = useQuery({
    queryKey: ["join-requests", session?.user?.id],
    queryFn: async () => {
      // First get the groups created by the user
      const { data: userGroups, error: groupsError } = await supabase
        .from("groups")
        .select("id")
        .eq("created_by", session?.user?.id);

      if (groupsError) {
        console.error("Error fetching user groups:", groupsError);
        throw groupsError;
      }

      const groupIds = userGroups.map(group => group.id);

      // Then get the join requests for those groups
      const { data, error } = await supabase
        .from("group_join_requests")
        .select(`
          id,
          group_id,
          user_id,
          status,
          message,
          editing_rights_on_accept,
          groups:group_id (
            id,
            name,
            created_by
          ),
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("status", "pending")
        .in("group_id", groupIds);

      if (error) {
        console.error("Error fetching join requests:", error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleRequest = async (requestId: string, status: "accepted" | "rejected", editingRights: boolean) => {
    try {
      if (status === "accepted") {
        const request = requests?.find((r) => r.id === requestId);
        if (!request) return;

        // Add user to group members with editing rights status
        const { error: memberError } = await supabase
          .from("group_members")
          .insert({
            group_id: request.group_id,
            user_id: request.user_id,
            role: "member",
            editing_rights: editingRights
          });

        if (memberError) throw memberError;
      }

      // Update request status
      const { error: statusError } = await supabase
        .from("group_join_requests")
        .update({ status })
        .eq("id", requestId);

      if (statusError) throw statusError;

      toast({
        title: "Success",
        description: `Request ${status}`,
      });

      refetch();
    } catch (error) {
      console.error("Error handling request:", error);
      toast({
        title: "Error",
        description: "Failed to process request",
        variant: "destructive",
      });
    }
  };

  const handleEditingRightsChange = async (requestId: string, editingRights: boolean) => {
    try {
      const { error } = await supabase
        .from("group_join_requests")
        .update({ editing_rights_on_accept: editingRights })
        .eq("id", requestId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating editing rights:", error);
      toast({
        title: "Error",
        description: "Failed to update editing rights",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pending Requests</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!requests || requests.length === 0 ? (
            <p className="text-center text-gray-500">No pending requests</p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col space-y-4 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {request.profiles?.username} wants to join {request.groups?.name}
                    </p>
                    {request.message && (
                      <p className="text-sm text-gray-500">{request.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`editing-rights-${request.id}`}
                    checked={request.editing_rights_on_accept}
                    onCheckedChange={(checked) => handleEditingRightsChange(request.id, checked)}
                  />
                  <Label htmlFor={`editing-rights-${request.id}`}>
                    Grant editing rights
                  </Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRequest(request.id, "accepted", request.editing_rights_on_accept)}
                    className="hover:bg-green-50 hover:text-green-600"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRequest(request.id, "rejected", false)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};