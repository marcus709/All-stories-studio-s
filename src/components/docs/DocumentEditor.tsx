import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentContent } from "@/types/story";
import { RichTextEditor } from "../editor/RichTextEditor";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface DocumentEditorProps {
  document?: Document;
  storyId: string;
  onSave?: () => void;
}

export function DocumentEditor({ document, storyId, onSave }: DocumentEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (document?.content) {
      try {
        // Process document content
        console.log("Processing document content:", document.content);
        const documentContent = document.content;
        if (Array.isArray(documentContent) && documentContent.length > 0) {
          const firstContent = documentContent[0];
          if (typeof firstContent === 'object' && 'content' in firstContent) {
            setContent(firstContent.content);
          }
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
  }, [document, toast]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log("Setting document data:", document);

      if (!title.trim()) {
        throw new Error("Title is required");
      }

      const documentContent: DocumentContent[] = [{
        type: "text",
        content: content
      }];

      console.log("Saving content:", documentContent);

      if (document?.id) {
        // Update existing document
        const { error } = await supabase
          .from("documents")
          .update({
            title,
            content: documentContent,
          })
          .eq("id", document.id);

        if (error) throw error;
      } else {
        // Create new document
        const { error } = await supabase.from("documents").insert({
          title,
          content: documentContent,
          story_id: storyId,
        });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Document saved successfully",
      });

      // Invalidate and refetch documents query
      queryClient.invalidateQueries({ queryKey: ["documents", storyId] });
      onSave?.();
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
    <div className="space-y-4">
      <Input
        placeholder="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg font-medium"
      />
      <div className="min-h-[500px] border rounded-lg">
        <RichTextEditor
          value={content}
          onChange={(value) => setContent(value)}
          className="min-h-[500px]"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
        >
          {isSaving ? "Saving..." : "Save Document"}
        </Button>
      </div>
    </div>
  );
}