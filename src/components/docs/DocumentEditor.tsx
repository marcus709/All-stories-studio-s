import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share } from "lucide-react";
import { ShareDocumentDialog } from "@/components/community/chat/ShareDocumentDialog";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";

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
  const { updateDocument } = useDocuments(storyId);
  const { toast } = useToast();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
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
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{document.title}</h2>
        <div className="flex gap-2">
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

      <ScrollArea className="flex-1 p-4">
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full h-full min-h-[500px] p-4 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Start writing your document..."
        />
      </ScrollArea>

      <ShareDocumentDialog
        document={document}
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      />
    </div>
  );
};