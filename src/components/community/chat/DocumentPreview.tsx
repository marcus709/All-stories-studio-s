import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

interface DocumentPreviewProps {
  document: {
    id: string;
    title: string;
    content: string;
  };
  isInMessage?: boolean;
}

export const DocumentPreview = ({ document, isInMessage }: DocumentPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(document.content);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Document content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // First, verify the document exists and get its current state
      const { data: existingDoc, error: fetchError } = await supabase
        .from("documents")
        .select("id")
        .eq("id", document.id)
        .maybeSingle();

      if (fetchError) {
        throw new Error("Failed to verify document existence");
      }

      if (!existingDoc) {
        throw new Error("Document not found");
      }

      // Then perform the update
      const { error: updateError } = await supabase
        .from("documents")
        .update({
          content: content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", document.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Document saved successfully",
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={`
          cursor-pointer p-3 rounded-lg transition-colors
          ${isInMessage 
            ? 'bg-gray-100/50 hover:bg-gray-200/50' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
          }
        `}
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-violet-500" />
          <h4 className="font-medium text-sm text-gray-900">{document.title}</h4>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b bg-white">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <FileText className="h-5 w-5 text-violet-500" />
              {document.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            <RichTextEditor 
              content={content} 
              onChange={setContent}
              className="flex-1"
            />
            
            <div className="p-4 bg-white border-t">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-violet-600 hover:bg-violet-700 ml-auto"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};