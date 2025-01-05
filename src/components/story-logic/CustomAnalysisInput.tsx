import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CustomAnalysisInputProps {
  onSubmit: (customInput: string) => void;
}

export const CustomAnalysisInput = ({ onSubmit }: CustomAnalysisInputProps) => {
  const [customInput, setCustomInput] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onSubmit(customInput);
    setOpen(false);
    setCustomInput("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Custom Analysis</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom Analysis Input</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Describe what you want the AI to look for in your story..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="min-h-[150px]"
          />
          <Button onClick={handleSubmit} className="w-full" disabled={!customInput.trim()}>
            Analyze
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};