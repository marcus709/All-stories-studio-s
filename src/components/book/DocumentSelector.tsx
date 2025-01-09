import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUpload } from "@/components/story-logic/DocumentUpload";
import { Document } from "@/types/story";

interface DocumentSelectorProps {
  documents: Document[];
  showDocumentSelector: boolean;
  setShowDocumentSelector: (show: boolean) => void;
  handleDocumentSelect: (doc: Document) => void;
  handleUploadComplete: () => void;
}

export const DocumentSelector = ({
  documents,
  showDocumentSelector,
  setShowDocumentSelector,
  handleDocumentSelect,
  handleUploadComplete,
}: DocumentSelectorProps) => {
  return (
    <Dialog open={showDocumentSelector} onOpenChange={setShowDocumentSelector}>
      <DialogTrigger asChild>
        <Button variant="outline">Select Document</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select or Upload Document for Analysis</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>
          <TabsContent value="existing">
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {documents?.map((doc) => (
                  <Button
                    key={doc.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleDocumentSelect(doc)}
                  >
                    {doc.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="upload">
            <DocumentUpload 
              storyId={''} 
              onUploadComplete={handleUploadComplete}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};