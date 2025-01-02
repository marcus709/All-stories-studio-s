import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CreateTopicDialog } from "./CreateTopicDialog";
import { useState } from "react";
import { Topic } from "@/integrations/supabase/types/tables.types";

export const Topics = () => {
  const session = useSession();
  const [open, setOpen] = useState(false);

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
            <h3 className="font-medium">{topic.name}</h3>
            <p className="text-sm text-gray-500">{topic.description}</p>
          </div>
        ))}
      </div>

      <CreateTopicDialog open={open} onOpenChange={setOpen} />
    </div>
  );
};
