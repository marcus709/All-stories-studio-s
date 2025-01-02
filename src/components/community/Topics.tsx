import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Hash, Globe, Users, Lock } from "lucide-react";
import { CreateTopicDialog } from "./CreateTopicDialog";
import { supabase } from "@/integrations/supabase/client";
import { Topic } from "@/integrations/supabase/types";

export const Topics = () => {
  const session = useSession();
  const [isCreateTopicOpen, setIsCreateTopicOpen] = useState(false);

  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Topic[];
    },
    enabled: !!session?.user,
  });

  const getPrivacyIcon = (privacy: Topic["privacy"]) => {
    switch (privacy) {
      case "public":
        return <Globe className="h-4 w-4 text-green-500" />;
      case "friends":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "private":
        return <Lock className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Topics</h1>
        <Button 
          onClick={() => setIsCreateTopicOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          + Create Topic
        </Button>
      </div>

      <div className="grid gap-4">
        {topics?.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-purple-500" />
              <div>
                <h3 className="font-medium">{topic.name}</h3>
                <p className="text-sm text-gray-500">{topic.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getPrivacyIcon(topic.privacy)}
            </div>
          </div>
        ))}
        {topics?.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No topics yet. Create one to get started!
          </div>
        )}
      </div>

      <CreateTopicDialog
        open={isCreateTopicOpen}
        onOpenChange={setIsCreateTopicOpen}
      />
    </div>
  );
};