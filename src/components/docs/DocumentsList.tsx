import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share, FileText, Plus, LayoutGrid, LayoutList } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShareDocumentDialog } from "./ShareDocumentDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Document } from "@/types/story";

interface DocumentsListProps {
  documents: Document[];
  onSelectDocument: (id: string) => void;
  selectedDocumentId: string | null;
}

export const DocumentsList = ({ documents, onSelectDocument, selectedDocumentId }: DocumentsListProps) => {
  const [shareDocument, setShareDocument] = useState<Document | null>(null);
  const [isGridView, setIsGridView] = useState(false);

  if (!documents?.length) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          No documents uploaded yet
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isGridView ? <LayoutGrid className="h-4 w-4 text-gray-500" /> : <LayoutList className="h-4 w-4 text-gray-500" />}
            <Switch
              id="grid-view"
              checked={isGridView}
              onCheckedChange={setIsGridView}
              className="data-[state=checked]:bg-purple-500"
            />
            <Label htmlFor="grid-view" className="text-sm text-gray-600">
              Grid View
            </Label>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)] px-4">
        <div className={`${isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}`}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              className={`${
                isGridView 
                  ? `p-6 border rounded-lg transition-colors cursor-pointer group
                     ${selectedDocumentId === doc.id 
                       ? 'border-purple-500 bg-purple-50' 
                       : 'hover:border-purple-500'}`
                  : `p-4 border rounded-lg transition-colors cursor-pointer group
                     ${selectedDocumentId === doc.id 
                       ? 'border-purple-500 bg-purple-50' 
                       : 'hover:border-purple-500'}`
              }`}
            >
              <div className="flex items-start gap-3">
                <FileText className={`h-5 w-5 ${
                  selectedDocumentId === doc.id 
                    ? 'text-purple-500' 
                    : 'text-gray-400 group-hover:text-purple-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${
                    selectedDocumentId === doc.id 
                      ? 'text-purple-700' 
                      : 'text-gray-900 group-hover:text-purple-500'
                  }`}>
                    {doc.title}
                  </h3>
                  {!isGridView && doc.created_at && (
                    <p className="text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareDocument(doc);
                  }}
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
              {isGridView && doc.created_at && (
                <p className="mt-2 text-sm text-gray-500">
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {isGridView && (
        <Button
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg"
          onClick={() => {/* Trigger new document creation */}}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <ShareDocumentDialog
        document={shareDocument!}
        open={!!shareDocument}
        onOpenChange={(open) => !open && setShareDocument(null)}
      />
    </div>
  );
};