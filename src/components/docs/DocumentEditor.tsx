import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { Json } from "@/integrations/supabase/types";
import { DocumentContent } from "@/types/story";

interface DocumentEditorProps {
  documentId: string;
  onRefresh: () => void;
}

export const DocumentEditor = ({ documentId, onRefresh }: DocumentEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const { data: document, refetch } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (error) {
        console.error("Error fetching document:", error);
        toast({
          title: "Error",
          description: "Failed to fetch document. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!documentId,
  });

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      
      // Handle different content formats
      if (document.content) {
        try {
          const docContent = document.content as Json;
          if (Array.isArray(docContent) && docContent.length > 0) {
            const firstItem = docContent[0] as unknown as DocumentContent;
            if (firstItem && typeof firstItem === 'object' && 'content' in firstItem) {
              setContent(firstItem.content || "");
            } else if (typeof firstItem === 'string') {
              setContent(firstItem);
            }
          } else if (typeof docContent === 'string') {
            setContent(docContent);
          }
        } catch (error) {
          console.error("Error processing document content:", error);
          toast({
            title: "Error",
            description: "Failed to load document content",
            variant: "destructive",
          });
        }
      }
    }
  }, [document, toast]);

  const handleSave = async () => {
    if (!documentId || isSaving) return;
    
    setIsSaving(true);
    try {
      if (!title.trim()) {
        throw new Error("Title is required");
      }

      // Properly structure the content as a JSON array
      const contentToSave = [{
        type: "text",
        content: content,
        version: "1.0"
      }] as unknown as Json;

      const { error } = await supabase
        .from("documents")
        .update({
          title: title.trim(),
          content: contentToSave,
          updated_at: new Date().toISOString()
        })
        .eq("id", documentId);

      if (error) throw error;

      await refetch();
      onRefresh();

      toast({
        title: "Success",
        description: "Document saved successfully",
      });
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const item = JSON.parse(e.dataTransfer.getData("application/json"));
      
      const { error } = await supabase
        .from("document_references")
        .insert({
          document_id: documentId,
          reference_type: item.type,
          reference_id: item.id,
          section_id: document.id,
        });

      if (error) throw error;

      const insertText = `\n\n[${item.type.toUpperCase()}: ${item.title}]\n${item.description || ''}\n\n`;
      setContent(prev => prev + insertText);
      
      toast({
        title: "Content Added",
        description: `${item.type} content has been added to your document`,
      });
    } catch (error) {
      console.error("Error handling drop:", error);
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
            placeholder="Enter document title"
          />
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving || !title.trim()} 
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
      
      <RichTextEditor
        content={content}
        onChange={setContent}
        className="flex-1 overflow-auto"
      />
    </div>
  );
};