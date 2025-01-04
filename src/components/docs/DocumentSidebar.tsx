import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { Button } from "@/components/ui/button";
import { PanelLeftClose } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: 'character' | 'plot' | 'idea';
}

export const DocumentSidebar = ({ onContentDrop }: { onContentDrop: (content: ContentItem) => void }) => {
  const { selectedStory } = useStory();

  const { data: documents } = useQuery({
    queryKey: ["documents", selectedStory?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("story_id", selectedStory?.id);
      return data || [];
    },
    enabled: !!selectedStory?.id,
  });

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold">Documents</h2>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
        {documents?.map((doc) => (
          <div
            key={doc.id}
            className="p-3 bg-sidebar-accent rounded-lg mb-2 cursor-pointer hover:bg-sidebar-accent/80 transition-colors"
          >
            <h4 className="font-medium text-sidebar-accent-foreground">{doc.title}</h4>
            <p className="text-sm text-sidebar-foreground/80">
              {new Date(doc.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};