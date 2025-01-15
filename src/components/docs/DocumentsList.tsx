import { Document } from "@/types/story";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentCard } from "./DocumentCard";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isSelected={doc.id === selectedDocumentId}
              onClick={() => onSelectDocument(doc.id)}
            />
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