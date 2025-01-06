import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentContent } from "@/types/story";
import { RichTextEditor } from "../editor/RichTextEditor";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Json } from "@/integrations/supabase/types";

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
  const { session } = useSessionContext();

  useEffect(() => {
    if (document?.content) {
      try {
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
      console.log("Saving content:", content);

      if (!title.trim()) {
        throw new Error("Title is required");
      }

      if (!session?.user?.id) {
        throw new Error("User must be logged in to save documents");
      }

      const documentContent = [{
        type: "text",
        content: content
      }] as Json[];

      console.log("Document content to save:", documentContent);

      if (document?.id) {
        const { error } = await supabase
          .from("documents")
          .update({
            title,
            content: documentContent,
            updated_at: new Date().toISOString()
          })
          .eq("id", document.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("documents")
          .insert({
            title,
            content: documentContent,
            story_id: storyId,
            user_id: session.user.id
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Document saved successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["documents", storyId] });
      onSave?.();
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
    <div className="space-y-4">
      <Input
        placeholder="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg font-medium"
      />
      <div className="min-h-[500px] border rounded-lg">
        <RichTextEditor
          content={content}
          onChange={(value) => {
            console.log("Content changed:", value);
            setContent(value);
          }}
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