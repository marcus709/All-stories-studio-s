import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WYSIWYGEditor } from "@/components/book/WYSIWYGEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WritingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plotEventId: string;
  documentId: string;
  sectionId: string | null;
  title: string;
  initialContent?: string;
}

export const WritingDialog = ({
  isOpen,
  onClose,
  plotEventId,
  documentId,
  sectionId,
  title,
  initialContent = "",
}: WritingDialogProps) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let section;
      if (sectionId) {
        const { data, error } = await supabase
          .from("document_sections")
          .update({ content })
          .eq("id", sectionId)
          .select()
          .single();
        
        if (error) throw error;
        section = data;
      } else {
        const { data, error } = await supabase
          .from("document_sections")
          .insert({
            document_id: documentId,
            type: "scene",
            title,
            content,
            order_index: 0,
          })
          .select()
          .single();
        
        if (error) throw error;
        section = data;

        // Link the plot event to the new section
        await supabase
          .from("plot_events")
          .update({ document_section_id: section.id })
          .eq("id", plotEventId);
      }

      toast({
        title: "Success",
        description: "Content saved successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <WYSIWYGEditor
              content={content}
              onChange={setContent}
              className="h-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};