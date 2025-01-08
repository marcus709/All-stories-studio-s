import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { 
  BookCopy, 
  ImagePlus, 
  Type, 
  Palette,
  RotateCcw
} from "lucide-react";

export const BookCreatorView = () => {
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [newChapter, setNewChapter] = useState({ title: "", content: "" });
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

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
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Virtual Book Designer</h1>
          <p className="text-gray-500">Create your perfect book cover</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Design
          </Button>
          <Button className="bg-violet-500 hover:bg-violet-600">
            Save Cover
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Left Panel - Design Tools */}
        <div className="w-80 border-r bg-white p-6">
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="templates">
                <BookCopy className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImagePlus className="h-4 w-4 mr-2" />
                Images
              </TabsTrigger>
              <TabsTrigger value="text">
                <Type className="h-4 w-4 mr-2" />
                Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                {['Fantasy', 'Romance', 'Thriller', 'Non-Fiction'].map((genre) => (
                  <Card key={genre} className="p-4 cursor-pointer hover:border-violet-500 transition-colors">
                    <div className="aspect-[2/3] bg-gray-100 rounded-md mb-2" />
                    <p className="text-sm text-center">{genre}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="images" className="mt-0">
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Upload Cover Image
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-2 cursor-pointer hover:border-violet-500">
                    <div className="aspect-square bg-gray-100 rounded-md" />
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-0">
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Type className="h-4 w-4 mr-2" />
                  Add Text Element
                </Button>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Text Styles</p>
                  {['Title', 'Subtitle', 'Author Name'].map((style) => (
                    <Card key={style} className="p-3 cursor-pointer hover:border-violet-500">
                      {style}
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Cover Preview */}
        <div className="flex-1 p-8 flex items-center justify-center bg-gray-100">
          <div className="aspect-[2/3] w-[400px] bg-white rounded-lg shadow-lg">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Your book cover will appear here
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 border-l bg-white p-6">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="h-5 w-5" />
            <h2 className="font-semibold">Properties</h2>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Select an element to edit its properties
          </p>
        </div>
      </div>
    </div>
  );
};