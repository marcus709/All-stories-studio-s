import { Document } from "@/types/story";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentCard } from "./DocumentCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

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
  isGridView,
}: DocumentsListProps) => {
  if (isGridView) {
    return (
      <ScrollArea className="h-full px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group cursor-pointer"
              onClick={() => onSelectDocument(doc.id)}
            >
              <div className="relative aspect-[8.5/11] mb-2 rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:text-gray-600">
                  <FileText className="h-12 w-12" />
                </div>
                {doc.content && (
                  <div className="absolute inset-0 p-4 text-xs text-gray-600 line-clamp-[12] overflow-hidden bg-white">
                    {doc.content}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-violet-600">
                  {doc.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {new Date(doc.updated_at || '').toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className="h-[calc(100vh-16rem)] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start">
      <Tabs defaultValue={documents[0]?.id} className="w-full">
        <TabsList className="mb-8">
          {documents.map((doc) => (
            <TabsTrigger
              key={doc.id}
              value={doc.id}
              className="text-sm font-medium"
              onClick={() => onSelectDocument(doc.id)}
            >
              {doc.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {documents.map((doc) => (
          <TabsContent key={doc.id} value={doc.id}>
            <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 bg-white border border-gray-200">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">{doc.title}</h2>
                <div className="text-gray-700 whitespace-pre-wrap">{doc.content}</div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};