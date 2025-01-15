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
  const { toast } = useToast();
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrCreateDocument = async () => {
      try {
        // Check if document already exists for this timeline
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

        // Create new document
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

  const handleSave = async () => {
    try {
      if (documentId) {
        await supabase
          .from("documents")
          .update({ content: editedContent })
          .eq("id", documentId);
      }
      
      onSave(editedContent);
      onClose();
      
      toast({
        title: "Success",
        description: "Content saved successfully",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[300px]"
            placeholder="Write your plot point details here..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};