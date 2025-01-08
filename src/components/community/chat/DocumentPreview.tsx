import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

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
        className={`
          cursor-pointer p-3 rounded-lg transition-colors
          ${isInMessage 
            ? 'bg-gray-100/50 hover:bg-gray-200/50' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
          }
        `}
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-violet-500" />
          <h4 className="font-medium text-sm text-gray-900">{document.title}</h4>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pb-4 border-b">
              <FileText className="h-5 w-5 text-violet-500" />
              {document.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full px-8">
            <div className="prose prose-sm max-w-none py-8">
              <div 
                dangerouslySetInnerHTML={{ __html: document.content }} 
                className="whitespace-pre-wrap font-instagram-draft text-gray-800 leading-relaxed max-w-[65ch] mx-auto"
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};