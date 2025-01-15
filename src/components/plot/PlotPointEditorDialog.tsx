import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

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
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
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
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};