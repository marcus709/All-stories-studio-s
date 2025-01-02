import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TopicPrivacy } from "@/integrations/supabase/types/enums.types";

interface CreateTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTopicDialog = ({ open, onOpenChange }: CreateTopicDialogProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<TopicPrivacy>("public");

  const createTopicMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("topics")
        .insert({
          name,
          description,
          privacy,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      toast({
        title: "Success",
        description: "Topic created successfully",
      });
      onOpenChange(false);
      setName("");
      setDescription("");
      setPrivacy("public");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create topic. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating topic:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTopicMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Topic Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter topic name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter topic description"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="privacy" className="text-sm font-medium">
              Privacy Level
            </label>
            <Select value={privacy} onValueChange={(value: TopicPrivacy) => setPrivacy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select privacy level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can view and post</SelectItem>
                <SelectItem value="friends">Friends Only - Only your friends can view and post</SelectItem>
                <SelectItem value="private">Private - Only you can view and post</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Create Topic
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
