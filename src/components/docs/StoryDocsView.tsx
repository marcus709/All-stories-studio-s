import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { StoryProvider } from "@/contexts/StoryContext";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, FileText, LayoutGrid, LayoutList } from "lucide-react";
import { CreateDocumentDialog } from "./CreateDocumentDialog";
import { DocumentEditor } from "./DocumentEditor";
import { DocumentSidebar } from "./DocumentSidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useStory } from "@/contexts/StoryContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const StoryDocsView = () => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
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
        console.error("Error fetching documents:", error);
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

  const selectedDocument = documents.find(doc => doc.id === selectedDocId);

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocId(docId);
    if (isGridView) {
      setIsGridView(false);
    }
  };

  const handleDocumentSave = () => {
    refetchDocs();
  };

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-gray-500">
        Please select a story to view documents
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Story Documents</h1>
          <p className="text-gray-500">Write and organize your story content</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isGridView ? (
              <LayoutGrid className="h-4 w-4 text-gray-500" />
            ) : (
              <LayoutList className="h-4 w-4 text-gray-500" />
            )}
            <Switch
              id="grid-view"
              checked={isGridView}
              onCheckedChange={setIsGridView}
              className="data-[state=checked]:bg-purple-500"
            />
            <Label htmlFor="grid-view" className="text-sm text-gray-600">
              Grid View
            </Label>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Document
          </Button>
        </div>
      </div>

      {isGridView ? (
        <div className="h-[calc(100vh-8rem)]">
          <DocumentsList
            documents={documents}
            onSelectDocument={handleDocumentSelect}
            selectedDocumentId={selectedDocId}
            isGridView={true}
          />
        </div>
      ) : (
        <div className="flex h-[calc(100vh-8rem)]">
          <div className="w-72 flex-shrink-0">
            <DocumentSidebar
              onContentDrop={() => {}}
              selectedDocId={selectedDocId}
              onSelectDocument={handleDocumentSelect}
              isGridView={false}
            />
          </div>
          <div className="flex-1">
            {selectedDocument ? (
              <DocumentEditor
                key={selectedDocument.id}
                document={selectedDocument}
                storyId={selectedStory.id}
                onSave={handleDocumentSave}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
                <FileText className="w-12 h-12 mb-4" />
                <p>Select a document to start editing</p>
              </div>
            )}
          </div>
        </div>
      )}

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