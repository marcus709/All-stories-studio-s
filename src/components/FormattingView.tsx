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
  PenTool,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Tablet,
  Smartphone,
  Printer,
  Download,
  AlertCircle
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
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";

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
  const [deviceView, setDeviceView] = useState<'print' | 'kindle' | 'ipad' | 'phone'>('print');
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string }>>([]);

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
      {/* Top Toolbar */}
      <div className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <BookCopy className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button variant="ghost" size="sm">
              <Type className="h-4 w-4 mr-2" />
              Fonts
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Margins
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Select value={deviceView} onValueChange={(value: any) => setDeviceView(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="print">
                <Printer className="h-4 w-4 mr-2 inline-block" />
                Print View
              </SelectItem>
              <SelectItem value="kindle">
                <Tablet className="h-4 w-4 mr-2 inline-block" />
                Kindle
              </SelectItem>
              <SelectItem value="ipad">
                <Laptop className="h-4 w-4 mr-2 inline-block" />
                iPad
              </SelectItem>
              <SelectItem value="phone">
                <Smartphone className="h-4 w-4 mr-2 inline-block" />
                Phone
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Chapter Navigation */}
        <div className="w-64 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Chapters</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="group">
                  <button className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-accent">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    <span>Chapter {index + 1}</span>
                    <span className="ml-auto text-muted-foreground">✓</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Preview Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8 overflow-y-auto">
            <PreviewScene 
              onSceneChange={setPreviewScene} 
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={false}
              className="h-full"
            >
              <PageTurner pages={renderBookPages()} className="max-w-[600px] mx-auto" />
            </PreviewScene>
          </div>

          {/* Bottom Notification Bar */}
          {notifications.length > 0 && (
            <div className="border-t border-border bg-card/50 p-2 space-y-2">
              {notifications.map((notification) => (
                <Alert key={notification.id} variant="default" className="bg-card/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{notification.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </div>

        {/* Right Customization Panel */}
        <div className="w-80 border-l border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Format Settings</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PropertiesPanel 
              selectedTemplate={selectedTemplate}
              selectedText={selectedText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
