import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

interface DocumentEditorProps {
  documentId: string;
  onRefresh: () => void;
}

interface DocumentContent {
  type: string;
  content: string;
}

export const DocumentEditor = ({ documentId, onRefresh }: DocumentEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const { data: document, refetch } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      console.log("Fetching document:", documentId);
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (error) {
        console.error("Error fetching document:", error);
        throw error;
      }
      console.log("Fetched document:", data);
      return data;
    },
    enabled: !!documentId,
    staleTime: 0,
  });

  useEffect(() => {
    if (document) {
      console.log("Setting document content:", document.content);
      setTitle(document.title);
      // Handle both string and array content formats with proper type checking
      if (Array.isArray(document.content)) {
        const contentArray = document.content as DocumentContent[];
        setContent(contentArray[0]?.content || "");
      } else if (typeof document.content === 'string') {
        setContent(document.content);
      } else {
        setContent("");
      }
    }
  }, [document]);

  const handleSave = async () => {
    if (!documentId || isSaving) return;
    
    setIsSaving(true);
    try {
      // Always save content in the expected array format
      const contentToSave: DocumentContent[] = [{
        type: "text",
        content: content
      }];
      
      console.log("Saving document:", { title, content: contentToSave });
      const { error } = await supabase
        .from("documents")
        .update({
          title,
          content: contentToSave,
        })
        .eq("id", documentId);

      if (error) throw error;

      // Refetch to ensure we have the latest data
      await refetch();
      // Notify parent to refresh the document list
      onRefresh();

      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      
      console.log("Document saved successfully");
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const item = JSON.parse(e.dataTransfer.getData("application/json"));
      
      await supabase.from("document_references").insert({
        document_id: documentId,
        reference_type: item.type,
        reference_id: item.id,
        section_id: document.id,
      });

      const insertText = `\n\n[${item.type.toUpperCase()}: ${item.title}]\n${item.description || ''}\n\n`;
      setContent(prev => prev + insertText);
      
      toast({
        title: "Content Added",
        description: `${item.type} content has been added to your document`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add content to document",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="flex-1 flex flex-col h-full p-6 space-y-4 overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
      
      <RichTextEditor
        content={content}
        onChange={setContent}
        className="flex-1"
      />
    </div>
  );
};