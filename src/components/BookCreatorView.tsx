import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookCopy, ImagePlus, Type } from "lucide-react";
import { Template } from "@/types/book";
import { DesignHeader } from "./book/DesignHeader";
import { TemplatePanel } from "./book/TemplatePanel";
import { ImageUploadPanel } from "./book/ImageUploadPanel";
import { PropertiesPanel } from "./book/PropertiesPanel";

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
  const [coverImage, setCoverImage] = useState<string | null>(null);

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
  };

  const handleResetDesign = () => {
    setSelectedTemplate(null);
    setCoverImage(null);
  };

  const handleSaveDesign = () => {
    // Implementation for saving the design will be added later
  };

  const handleImageUpload = (url: string) => {
    setCoverImage(url);
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
      <DesignHeader
        onResetDesign={handleResetDesign}
        onSaveDesign={handleSaveDesign}
      />

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
              <TemplatePanel
                templates={templates}
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect}
              />
            </TabsContent>

            <TabsContent value="images" className="mt-0">
              <ImageUploadPanel onImageUpload={handleImageUpload} />
            </TabsContent>

            <TabsContent value="text" className="mt-0">
              <div className="space-y-4">
                {/* Text editing functionality will be implemented next */}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Cover Preview */}
        <div className="flex-1 p-8 flex items-center justify-center bg-gray-100">
          <div className="aspect-[2/3] w-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage}
                alt="Book Cover"
                className="w-full h-full object-cover"
              />
            ) : selectedTemplate ? (
              <div
                className="w-full h-full bg-gradient-to-br flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${selectedTemplate.colors.join(
                    ", "
                  )})`,
                }}
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
        <PropertiesPanel selectedTemplate={selectedTemplate} />
      </div>
    </div>
  );
};
