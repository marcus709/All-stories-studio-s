import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CreateTopicDialog } from "./CreateTopicDialog";
import { DeleteTopicDialog } from "./DeleteTopicDialog";
import { useState } from "react";
import { Topic } from "@/integrations/supabase/types/tables.types";
import { useToast } from "@/components/ui/use-toast";

export const Topics = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [deleteTopicId, setDeleteTopicId] = useState<string | null>(null);

  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .eq("user_id", session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (topicId: string) => {
      const { error } = await supabase
        .from("topics")
        .delete()
        .eq("id", topicId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });
      setDeleteTopicId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete topic",
        variant: "destructive",
      });
      console.error("Error deleting topic:", error);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Topics</h2>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Topic
        </Button>
      </div>

      <div className="space-y-4">
        {topics?.map((topic: Topic) => (
          <div key={topic.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{topic.name}</h3>
                <p className="text-sm text-gray-500">{topic.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteTopicId(topic.id)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CreateTopicDialog open={open} onOpenChange={setOpen} />
      <DeleteTopicDialog
        isOpen={!!deleteTopicId}
        onClose={() => setDeleteTopicId(null)}
        onConfirm={() => deleteTopicMutation.mutate(deleteTopicId!)}
      />
    </div>
  );
};