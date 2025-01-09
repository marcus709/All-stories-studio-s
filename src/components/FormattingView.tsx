import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BookCopy, 
  ImagePlus, 
  Type, 
  Globe, 
  Palette,
  BookOpen,
  FileText,
  Settings,
  PenTool
} from "lucide-react";
import { Template } from "@/types/book";
import { DesignHeader } from "./book/DesignHeader";
import { TemplatePanel } from "./book/TemplatePanel";
import { ImageUploadPanel } from "./book/ImageUploadPanel";
import { PropertiesPanel } from "./book/PropertiesPanel";
import { PageTurner } from "./book/PageTurner";
import { BookSizeSelector, BookSize } from "./book/BookSizeSelector";
import { PreviewScene } from "./book/PreviewScene";
import { CoverTextEditor } from "./book/CoverTextEditor";
import { IText } from "fabric";
import { cn } from "@/lib/utils";

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

export const FormattingView = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState("templates");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [bookSize, setBookSize] = useState<BookSize>({ width: 6, height: 9, name: "Trade Paperback (6\" × 9\")" });
  const [previewScene, setPreviewScene] = useState("none");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [coverTexts, setCoverTexts] = useState<Array<{ text: string; font: string; size: number; x: number; y: number }>>([]);
  const [selectedText, setSelectedText] = useState<IText | null>(null);

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

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleTextUpdate = (texts: Array<{ text: string; font: string; size: number; x: number; y: number }>) => {
    setCoverTexts(texts);
  };

  const handleTextSelect = (text: IText | null) => {
    setSelectedText(text);
  };

  const renderBookPages = () => {
    const pages = [
      // Cover
      <div
        key="cover"
        className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden relative"
        style={{
          aspectRatio: `${bookSize.width} / ${bookSize.height}`,
        }}
      >
        {coverImage ? (
          <div className="relative w-full h-full">
            <img
              src={coverImage}
              alt="Book Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0">
              <CoverTextEditor
                width={bookSize.width * 100}
                height={bookSize.height * 100}
                onTextUpdate={handleTextUpdate}
                onTextSelect={handleTextSelect}
              />
            </div>
          </div>
        ) : selectedTemplate ? (
          <div
            className="w-full h-full bg-gradient-to-br flex items-center justify-center relative"
            style={{
              background: `linear-gradient(to bottom right, ${selectedTemplate.colors.join(
                ", "
              )})`,
            }}
          >
            <CoverTextEditor
              width={bookSize.width * 100}
              height={bookSize.height * 100}
              onTextUpdate={handleTextUpdate}
              onTextSelect={handleTextSelect}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Select a template to start designing
          </div>
        )}
      </div>,
      // Back cover
      <div
        key="back"
        className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden"
        style={{
          aspectRatio: `${bookSize.width} / ${bookSize.height}`,
        }}
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Back Cover</h2>
          <p className="text-gray-600">Add your book description here...</p>
        </div>
      </div>,
    ];

    return pages;
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-50">
        <div className="h-full p-8">
          <PreviewScene 
            onSceneChange={setPreviewScene} 
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={true}
            className="h-full"
          >
            <PageTurner 
              pages={renderBookPages()} 
              className="max-w-[800px] mx-auto h-full" 
            />
          </PreviewScene>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <DesignHeader
        onResetDesign={handleResetDesign}
        onSaveDesign={handleSaveDesign}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Design Tools */}
        <div className="w-72 border-r border-border bg-card">
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Templates</h2>
              </div>
              
              <nav className="space-y-1">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                  <BookCopy className="w-4 h-4" />
                  <span>Fiction</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                  <FileText className="w-4 h-4" />
                  <span>Non-Fiction</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                  <Palette className="w-4 h-4" />
                  <span>Art Books</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-accent">
                  <BookOpen className="w-4 h-4" />
                  <span>Academic</span>
                </button>
              </nav>

              <div className="pt-4">
                <Tabs defaultValue="templates" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="templates">
                      <PenTool className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="images">
                      <ImagePlus className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="text">
                      <Type className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="mt-4">
                    <TemplatePanel
                      templates={templates}
                      selectedTemplate={selectedTemplate}
                      onTemplateSelect={handleTemplateSelect}
                    />
                    <div className="mt-6">
                      <BookSizeSelector onSizeChange={setBookSize} />
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="mt-4">
                    <ImageUploadPanel onImageUpload={handleImageUpload} />
                  </TabsContent>

                  <TabsContent value="text" className="mt-4">
                    <div className="space-y-4">
                      {/* Text editing functionality will be implemented next */}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Book Preview */}
        <div className="flex-1 bg-background">
          <div className="h-full p-8">
            <PreviewScene 
              onSceneChange={setPreviewScene} 
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={false}
              className="h-full"
            >
              <PageTurner pages={renderBookPages()} className="max-w-[600px] mx-auto" />
            </PreviewScene>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 border-l border-border bg-card">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Book Formatting</h2>
              <Settings className="w-5 h-5" />
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Chapters</span>
                  <p className="text-2xl font-semibold">12</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Fonts</span>
                  <p className="text-2xl font-semibold">23</p>
                </div>
              </div>
              
              <PropertiesPanel 
                selectedTemplate={selectedTemplate}
                selectedText={selectedText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};