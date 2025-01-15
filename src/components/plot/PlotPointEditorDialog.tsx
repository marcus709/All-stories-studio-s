import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import debounce from "lodash/debounce";

interface PlotPointEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  storyId: string;
  timelineId: string;
  onSave: (content: string) => Promise<void>;
}

export const PlotPointEditorDialog = ({
  isOpen,
  onClose,
  title,
  content: initialContent = "",
  storyId,
  timelineId,
  onSave,
}: PlotPointEditorDialogProps) => {
  const [content, setContent] = useState(initialContent);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const debouncedSave = debounce(async (content: string) => {
    try {
      await onSave(content);
      
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["documents", storyId] });
      
      toast({
        title: "Success",
        description: "Plot points saved and organized",
      });
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    }
  }, 1000);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedSave(newContent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4">
          <div className="prose max-w-none">
            <RichTextEditor
              content={content}
              onChange={handleContentChange}
              className="min-h-[60vh]"
            />
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};