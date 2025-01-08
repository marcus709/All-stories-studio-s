import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Plus, PanelLeftClose, PanelLeft } from "lucide-react";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookStructureSelect } from "./book/BookStructureSelect";
import { ChapterView } from "./book/ChapterView";
import { BookPreview } from "./book/BookPreview";

export const BookCreatorView = () => {
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [newChapter, setNewChapter] = useState({ title: "", content: "" });
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const { data: bookStructures } = useQuery({
    queryKey: ["bookStructures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plot_structures")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Virtual Book Creator</h1>
          <p className="text-gray-500">Design and structure your book</p>
        </div>
        <div className="flex items-center gap-2">
          {!showSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(true)}
              className="h-9 w-9"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          )}
          <Button className="bg-violet-500 hover:bg-violet-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Chapter
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-12rem)]">
        {showSidebar && (
          <ResizablePanel 
            defaultSize={25} 
            minSize={20} 
            maxSize={40}
            className="border-r"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Book Structure</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(false)}
                className="h-8 w-8"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4">
                <BookStructureSelect
                  bookStructures={bookStructures}
                  selectedStructure={selectedStructure}
                  onStructureChange={(value) => {
                    setSelectedStructure(value);
                    setActiveChapter(null);
                  }}
                />

                {selectedStructure && (
                  <div className="grid grid-cols-1 gap-4 mt-6">
                    <ChapterView
                      structure={selectedStructure}
                      activeChapter={activeChapter}
                      onChapterClick={setActiveChapter}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
          </ResizablePanel>
        )}
        
        <ResizablePanel defaultSize={75}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <BookPreview
                selectedDocument={selectedDocument}
                onDocumentSelect={setSelectedDocument}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};