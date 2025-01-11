import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share, FileText, Plus, MoreVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShareDocumentDialog } from "./ShareDocumentDialog";
import { Document } from "@/types/story";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentsListProps {
  documents: Document[];
  onSelectDocument: (id: string) => void;
  selectedDocumentId: string | null;
  isGridView: boolean;
}

export const DocumentsList = ({ 
  documents, 
  onSelectDocument, 
  selectedDocumentId,
  isGridView 
}: DocumentsListProps) => {
  const [shareDocument, setShareDocument] = useState<Document | null>(null);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative h-full">
      <ScrollArea className={`h-[calc(100vh-16rem)] ${isGridView ? 'px-6' : 'px-4'}`}>
        <div className={`${
          isGridView 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' 
            : 'flex flex-col space-y-2'
        }`}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              className={`
                group relative
                ${isGridView 
                  ? 'aspect-[4/5] border rounded-lg transition-shadow hover:shadow-md cursor-pointer bg-white' 
                  : 'p-4 border rounded-lg transition-colors cursor-pointer hover:border-purple-500'
                }
                ${selectedDocumentId === doc.id 
                  ? 'border-purple-500 ring-2 ring-purple-200' 
                  : 'border-gray-200'
                }
              `}
            >
              {isGridView ? (
                <>
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <div className="aspect-[8.5/11] bg-gray-50 rounded mb-3 p-2 text-[8px] overflow-hidden text-gray-400">
                        {doc.content}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm truncate text-gray-900">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setShareDocument(doc);
                        }}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-3">
                  <FileText className={`h-5 w-5 ${
                    selectedDocumentId === doc.id 
                      ? 'text-purple-500' 
                      : 'text-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${
                      selectedDocumentId === doc.id 
                        ? 'text-purple-700' 
                        : 'text-gray-900'
                    }`}>
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(doc.created_at)}
                    </p>
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