import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  BookCopy, 
  ImagePlus, 
  Type, 
  Palette,
  RotateCcw
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  genre: string;
  previewUrl: string;
  colors: string[];
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Fantasy Epic',
    genre: 'Fantasy',
    previewUrl: '/placeholder.svg',
    colors: ['#9b87f5', '#D6BCFA', '#7E69AB']
  },
  {
    id: '2',
    name: 'Romance Novel',
    genre: 'Romance',
    previewUrl: '/placeholder.svg',
    colors: ['#FFDEE2', '#FEC6A1', '#F97316']
  },
  {
    id: '3',
    name: 'Mystery Thriller',
    genre: 'Thriller',
    previewUrl: '/placeholder.svg',
    colors: ['#222222', '#8E9196', '#D3E4FD']
  },
  {
    id: '4',
    name: 'Business Guide',
    genre: 'Non-Fiction',
    previewUrl: '/placeholder.svg',
    colors: ['#0EA5E9', '#33C3F0', '#D3E4FD']
  }
];

export const BookCreatorView = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState("templates");
  const { toast } = useToast();

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

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    toast({
      title: "Template Selected",
      description: `${template.name} template has been applied to your cover.`,
    });
  };

  const handleResetDesign = () => {
    setSelectedTemplate(null);
    toast({
      title: "Design Reset",
      description: "Your cover design has been reset.",
    });
  };

  const handleSaveDesign = () => {
    toast({
      title: "Design Saved",
      description: "Your cover design has been saved successfully.",
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Virtual Book Designer</h1>
          <p className="text-gray-500">Create your perfect book cover</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetDesign}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Design
          </Button>
          <Button className="bg-violet-500 hover:bg-violet-600" onClick={handleSaveDesign}>
            Save Cover
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Left Panel - Design Tools */}
        <div className="w-80 border-r bg-white p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                      selectedTemplate?.id === template.id 
                        ? 'ring-2 ring-violet-500' 
                        : 'hover:border-violet-500'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="aspect-[2/3] bg-gradient-to-br from-[${template.colors[0]}] via-[${template.colors[1]}] to-[${template.colors[2]}] rounded-md mb-2" />
                    <p className="text-sm text-center font-medium">{template.name}</p>
                    <p className="text-xs text-center text-gray-500">{template.genre}</p>
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
          <div className="aspect-[2/3] w-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
            {selectedTemplate ? (
              <div 
                className="w-full h-full bg-gradient-to-br from-[${selectedTemplate.colors[0]}] via-[${selectedTemplate.colors[1]}] to-[${selectedTemplate.colors[2]}] flex items-center justify-center"
              >
                <p className="text-white text-xl font-bold">Your Book Title</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Select a template to start designing
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 border-l bg-white p-6">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="h-5 w-5" />
            <h2 className="font-semibold">Properties</h2>
          </div>
          {selectedTemplate ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Template</p>
                <p className="text-sm text-gray-500">{selectedTemplate.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Genre</p>
                <p className="text-sm text-gray-500">{selectedTemplate.genre}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Colors</p>
                <div className="flex gap-2">
                  {selectedTemplate.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              Select an element to edit its properties
            </p>
          )}
        </div>
      </div>
    </div>
  );
};