import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share, Eye } from "lucide-react";
import { ShareDocumentDialog } from "@/components/community/chat/ShareDocumentDialog";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";
import { WYSIWYGEditor } from "@/components/book/WYSIWYGEditor";
import { InsightsSidebar } from "./InsightsSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DocumentEditorProps {
  document: {
    id: string;
    title: string;
    content: string;
  };
  storyId: string;
  onSave: () => void;
}

export const DocumentEditor = ({ document, storyId, onSave }: DocumentEditorProps) => {
  const [content, setContent] = useState(document.content);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const { updateDocument } = useDocuments(storyId);
  const { toast } = useToast();

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateDocument({
        id: document.id,
        content: content
      });
      
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      
      onSave();
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-lg font-semibold">{document.title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowInsights(!showInsights)}
          >
            <Eye className="h-4 w-4" />
            Insights
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <SidebarProvider>
        <div className="flex flex-1 w-full">
          <ScrollArea className="flex-1 p-8">
            <div className="max-w-[850px] mx-auto">
              <WYSIWYGEditor
                content={content}
                onChange={handleContentChange}
                className="min-h-[1100px] bg-white shadow-sm rounded-sm"
              />
            </div>
          </ScrollArea>
          {showInsights && (
            <InsightsSidebar document={{ ...document, content }} />
          )}
        </div>
      </SidebarProvider>

      <ShareDocumentDialog
        document={document}
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      />
    </div>
  );
};