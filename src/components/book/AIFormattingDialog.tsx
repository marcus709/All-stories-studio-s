import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wand2 } from "lucide-react";

interface AIFormattingDialogProps {
  onConfigSubmit: (config: any) => void;
  disabled?: boolean;
}

export function AIFormattingDialog({ onConfigSubmit, disabled }: AIFormattingDialogProps) {
  const handleSubmit = () => {
    // For now, we'll just pass a simple config object
    onConfigSubmit({
      style: "professional",
      format: "standard",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2"
          disabled={disabled}
        >
          <Wand2 className="h-4 w-4" />
          Format
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Formatting Assistant</DialogTitle>
          <DialogDescription>
            Let our AI assistant help you format your document according to industry standards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            The AI will analyze your document and apply professional formatting based on best practices for book publishing.
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>
            Start Formatting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}