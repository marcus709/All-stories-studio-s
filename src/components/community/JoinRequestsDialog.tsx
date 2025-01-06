import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

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
      const { data, error } = await supabase
        .from("group_join_requests")
        .select(`
          id,
          group_id,
          user_id,
          status,
          message,
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
        .in("group_id", 
          supabase
            .from("groups")
            .select("id")
            .eq("created_by", session?.user?.id)
        );

      if (error) {
        console.error("Error fetching join requests:", error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleRequest = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      if (status === "accepted") {
        const request = requests?.find((r) => r.id === requestId);
        if (!request) return;

        // Add user to group members
        const { error: memberError } = await supabase
          .from("group_members")
          .insert({
            group_id: request.group_id,
            user_id: request.user_id,
            role: "member",
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
                className="flex items-center justify-between space-x-4 rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    {request.profiles?.username} wants to join {request.groups?.name}
                  </p>
                  {request.message && (
                    <p className="text-sm text-gray-500">{request.message}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRequest(request.id, "accepted")}
                    className="hover:bg-green-50 hover:text-green-600"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRequest(request.id, "rejected")}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
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