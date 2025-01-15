import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import debounce from "lodash/debounce";

interface PlotPointEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  storyId: string;
  timelineId: string;
  onSave: (content: string) => void;
}

export const PlotPointEditorDialog = ({
  isOpen,
  onClose,
  title,
  content,
  storyId,
  timelineId,
  onSave,
}: PlotPointEditorDialogProps) => {
  const [editedContent, setEditedContent] = useState(content);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auto-save debounced function
  const debouncedSave = debounce(async (content: string, docId: string) => {
    try {
      // First update the document
      const { error: updateError } = await supabase
        .from("documents")
        .update({ content })
        .eq("id", docId);

      if (updateError) throw updateError;

      // Then get all plot points for sorting
      const { data: plotPoints, error: fetchError } = await supabase
        .from("timeline_documents")
        .select("document_id")
        .eq("timeline_id", timelineId);

      if (fetchError) throw fetchError;

      // Call the sorting function with proper JSON data
      const { data: sortedPoints, error: sortError } = await supabase.functions
        .invoke("sort-plot-points", {
          body: { 
            plotPoints: plotPoints.map(p => ({
              id: p.document_id,
              content: content
            }))
          }
        });

      if (sortError) throw sortError;

      // Update document with sorted points
      const { error: finalUpdateError } = await supabase
        .from("documents")
        .update({ 
          content: JSON.stringify(sortedPoints, null, 2)
        })
        .eq("id", docId);

      if (finalUpdateError) throw finalUpdateError;

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["documents", storyId] });
      
    } catch (error) {
      console.error("Error auto-saving:", error);
      toast({
        title: "Error",
        description: "Failed to auto-save content",
        variant: "destructive",
      });
    }
  }, 1000);

  useEffect(() => {
    const fetchOrCreateDocument = async () => {
      try {
        // Check if document exists
        const { data: existingDoc, error: fetchError } = await supabase
          .from("timeline_documents")
          .select("document_id")
          .eq("timeline_id", timelineId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingDoc) {
          setDocumentId(existingDoc.document_id);
          return;
        }

        // Create new document if none exists
        const { data: newDoc, error: docError } = await supabase
          .from("documents")
          .insert({
            story_id: storyId,
            title: `Timeline Notes - ${title}`,
            content: content,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          })
          .select()
          .single();

        if (docError) throw docError;

        // Link document to timeline
        const { error: linkError } = await supabase
          .from("timeline_documents")
          .insert({
            timeline_id: timelineId,
            document_id: newDoc.id,
          });

        if (linkError) throw linkError;

        setDocumentId(newDoc.id);
      } catch (error) {
        console.error("Error managing document:", error);
        toast({
          title: "Error",
          description: "Failed to manage timeline document",
          variant: "destructive",
        });
      }
    };

    if (isOpen && timelineId) {
      fetchOrCreateDocument();
    }
  }, [isOpen, timelineId, storyId, title, content, toast]);

  // Trigger auto-save when content changes
  useEffect(() => {
    if (documentId && editedContent !== content) {
      debouncedSave(editedContent, documentId);
    }
  }, [editedContent, documentId, content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const handleClose = () => {
    onSave(editedContent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={editedContent}
            onChange={handleContentChange}
            className="min-h-[300px]"
            placeholder="Write your plot point details here..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};