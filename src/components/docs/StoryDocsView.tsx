import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { CreateDocumentDialog } from "./CreateDocumentDialog";
import { DocumentEditor } from "./DocumentEditor";
import { DocumentsList } from "./DocumentsList";

export const StoryDocsView = () => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { selectedStory } = useStory();
  const { toast } = useToast();

  const { data: documents = [], refetch: refetchDocs } = useQuery({
    queryKey: ["documents", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory) return [];
      
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch documents",
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!selectedStory?.id,
  });

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-gray-500">
        Please select a story to view documents
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Story Documents</h1>
          <p className="text-gray-500">Write and organize your story content</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Document
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <DocumentsList
            documents={documents}
            selectedDocId={selectedDocId}
            onSelectDocument={setSelectedDocId}
            onRefresh={refetchDocs}
          />
        </div>
        <div className="col-span-9">
          {selectedDocId ? (
            <DocumentEditor documentId={selectedDocId} onRefresh={refetchDocs} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-500">
              <FileText className="w-12 h-12 mb-4" />
              <p>Select a document to start editing</p>
            </div>
          )}
        </div>
      </div>

      <CreateDocumentDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onDocumentCreated={() => {
          refetchDocs();
          setIsCreateDialogOpen(false);
        }}
      />
    </div>
  );
};