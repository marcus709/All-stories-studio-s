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
        <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0">
          <div className="flex flex-col h-full bg-zinc-50">
            <DialogHeader className="px-6 py-4 border-b bg-white">
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <FileText className="h-5 w-5 text-violet-500" />
                {document.title}
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1 p-12">
              <div className="max-w-[750px] mx-auto">
                <div 
                  dangerouslySetInnerHTML={{ __html: document.content }} 
                  className="prose prose-slate prose-lg max-w-none
                    prose-headings:font-semibold
                    prose-h1:text-3xl prose-h1:mb-8
                    prose-h2:text-2xl prose-h2:mb-6
                    prose-p:leading-relaxed prose-p:mb-6
                    prose-li:leading-relaxed
                    prose-img:rounded-lg
                    prose-blockquote:border-l-4 prose-blockquote:border-gray-300
                    prose-blockquote:pl-4 prose-blockquote:italic
                    prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg
                    prose-code:text-violet-600 prose-code:bg-violet-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                    prose-strong:text-gray-900
                    prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
                  "
                />
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};