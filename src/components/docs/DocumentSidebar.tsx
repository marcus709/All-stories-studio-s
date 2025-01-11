import { DocumentsList } from "./DocumentsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { Document } from "@/types/story";

interface DocumentSidebarProps {
  onContentDrop: () => void;
  selectedDocId: string | null;
  onSelectDocument: (id: string) => void;
  isGridView: boolean;
}

export const DocumentSidebar = ({ 
  onContentDrop, 
  selectedDocId, 
  onSelectDocument,
  isGridView 
}: DocumentSidebarProps) => {
  const { selectedStory } = useStory();

  const { data: documents = [] } = useQuery({
    queryKey: ["documents", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory) return [];
      
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching documents:", error);
        return [];
      }

      return data as Document[];
    },
    enabled: !!selectedStory?.id,
  });

  return (
    <div className="h-full border-r">
      <DocumentsList
        documents={documents}
        onSelectDocument={onSelectDocument}
        selectedDocumentId={selectedDocId}
        isGridView={isGridView}
      />
    </div>
  );
};