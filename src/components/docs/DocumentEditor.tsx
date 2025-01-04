import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { DocumentSidebar } from "./DocumentSidebar";

interface DocumentEditorProps {
  documentId: string;
  onRefresh: () => void;
}

export const DocumentEditor = ({ documentId, onRefresh }: DocumentEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const { data: document } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!documentId,
  });

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content?.[0]?.content || "");
    }
  }, [document]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("documents")
        .update({
          title,
          content: [{ type: "text", content }],
        })
        .eq("id", documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      onRefresh();
    } catch (error) {
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
      
      // Create a reference to the dropped content
      await supabase.from("document_references").insert({
        document_id: documentId,
        section_id: document.sections?.[0]?.id,
        reference_type: item.type,
        reference_id: item.id,
      });

      // Insert the content at cursor position or at the end
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
    <div className="flex h-full">
      <div 
        className="flex-1 bg-white rounded-lg shadow-sm p-6 space-y-4"
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
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[500px] resize-none p-4"
          placeholder="Start writing your story..."
        />
      </div>
      <DocumentSidebar onContentDrop={(content) => {
        const insertText = `\n\n[${content.type.toUpperCase()}: ${content.title}]\n${content.description || ''}\n\n`;
        setContent(prev => prev + insertText);
      }} />
    </div>
  );
};