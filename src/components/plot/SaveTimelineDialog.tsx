import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SaveTimelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => Promise<void>;
  selectedTemplate: string | null;
}

export const SaveTimelineDialog = ({ isOpen, onClose, onSave, selectedTemplate }: SaveTimelineDialogProps) => {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your story",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(title);
      setTitle("");
      onClose();
    } catch (error) {
      console.error("Error saving timeline:", error);
      toast({
        title: "Error",
        description: "Failed to save timeline",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save {selectedTemplate} Timeline</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter story title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Timeline"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};