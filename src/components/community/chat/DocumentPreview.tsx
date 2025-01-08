import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentPreviewProps {
  document: {
    id: string;
    title: string;
    content: string;
  };
  isInMessage?: boolean;
}

export const DocumentPreview = ({ document, isInMessage }: DocumentPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={`cursor-pointer p-3 rounded-lg ${
          isInMessage ? 'bg-gray-100/50' : 'bg-gray-100'
        } hover:bg-gray-200/50 transition-colors`}
      >
        <h4 className="font-medium text-sm">📄 {document.title}</h4>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{document.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full pr-4">
            <div className="prose prose-sm max-w-none">
              {document.content}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};