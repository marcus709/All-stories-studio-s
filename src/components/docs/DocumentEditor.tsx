import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/story";
import { RichTextEditor } from "../editor/RichTextEditor";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface DocumentEditorProps {
  document?: Document;
  storyId: string;
  onSave?: () => void;
}

export function DocumentEditor({ document, storyId, onSave }: DocumentEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(document?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const { session } = useSessionContext();

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content || "");
    }
  }, [document]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log("Saving document with content:", content);

      if (!title.trim()) {
        throw new Error("Title is required");
      }

      if (!session?.user?.id) {
        throw new Error("User must be logged in to save documents");
      }

      const { data, error } = document?.id 
        ? await supabase
            .from("documents")
            .update({
              title,
              content,
              updated_at: new Date().toISOString()
            })
            .eq("id", document.id)
            .select()
            .single()
        : await supabase
            .from("documents")
            .insert({
              title,
              content,
              story_id: storyId,
              user_id: session.user.id
            })
            .select()
            .single();

      if (error) throw error;

      console.log("Saved document:", data);

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
          onChange={setContent}
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