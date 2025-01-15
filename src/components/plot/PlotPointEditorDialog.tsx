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
  documentId: string;
  timelineId: string;
  storyId: string;
  initialContent?: string;
}

export const PlotPointEditorDialog = ({
  isOpen,
  onClose,
  documentId,
  timelineId,
  storyId,
  initialContent = "",
}: PlotPointEditorDialogProps) => {
  const [content, setContent] = useState(initialContent);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

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

      // Format the content in a more structured way
      const formattedContent = `
<div class="plot-points-container">
  <div class="main-plot">
    <h2 class="text-xl font-bold mb-4 text-purple-700">Main Plot Points</h2>
    <div class="space-y-4">
      ${sortedPoints.mainPlotPoints.map((point: any, index: number) => `
        <div class="bg-white p-4 rounded-lg shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
          <span class="text-sm font-medium text-purple-600">#${index + 1}</span>
          <div class="mt-2">${point.content}</div>
        </div>
      `).join('')}
    </div>
  </div>
  
  <div class="sub-plots mt-8">
    <h2 class="text-xl font-bold mb-4 text-indigo-700">Sub Plots</h2>
    <div class="space-y-4">
      ${sortedPoints.subPlotPoints.map((point: any, index: number) => `
        <div class="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 hover:border-indigo-300 transition-colors">
          <span class="text-sm font-medium text-indigo-600">Subplot ${index + 1}</span>
          <div class="mt-2">${point.content}</div>
        </div>
      `).join('')}
    </div>
  </div>
</div>
      `.trim();

      // Update document with formatted content
      const { error: finalUpdateError } = await supabase
        .from("documents")
        .update({ content: formattedContent })
        .eq("id", docId);

      if (finalUpdateError) throw finalUpdateError;

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
    debouncedSave(newContent, documentId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Plot Point</DialogTitle>
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