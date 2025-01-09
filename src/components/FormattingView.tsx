import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Template } from "@/types/book";
import { IText } from "fabric";
import { TextFormattingTools } from "./book/TextFormattingTools";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleLeft, ToggleRight, ZoomIn, ZoomOut } from "lucide-react";
import { AIFormattingDialog } from "./book/AIFormattingDialog";
import { DocumentSelector } from "./book/DocumentSelector";
import { ExportOptionsDialog } from "./book/ExportOptionsDialog";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useStory } from "@/contexts/StoryContext";
import { Document } from "@/types/story";
import { PreviewScene } from "./book/PreviewScene";
import { DevicePreview } from "./book/DevicePreview";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";

export const FormattingView = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState("print");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [previewScene, setPreviewScene] = useState("none");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [coverTexts, setCoverTexts] = useState<Array<{ text: string; font: string; size: number; x: number; y: number }>>([]);
  const [selectedText, setSelectedText] = useState<IText | null>(null);
  const [deviceView, setDeviceView] = useState<'kindle' | 'ipad' | 'phone' | 'print'>('print');
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string }>>([]);
  const [isAIMode, setIsAIMode] = useState(true);
  const [showManualModeAlert, setShowManualModeAlert] = useState(false);
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [hasFormattedDocument, setHasFormattedDocument] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const { toast } = useToast();
  const { selectedStory } = useStory();

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const { data: documents = [] } = useQuery({
    queryKey: ["documents", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Document[];
    },
    enabled: !!selectedStory?.id,
  });

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  return (
    <div className="min-h-screen bg-white/90 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-16 border-b border-gray-200/60 bg-white/50 backdrop-blur-sm flex items-center px-6 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <ToggleRight className="h-5 w-5 text-purple-500" />
              <Label htmlFor="ai-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                AI Assistant
              </Label>
            </div>
            <Switch
              id="ai-mode"
              checked={true}
              onCheckedChange={() => setIsAIMode(!isAIMode)}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen Preview */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex justify-between mb-4">
            <DocumentSelector
              documents={documents}
              showDocumentSelector={showDocumentSelector}
              setShowDocumentSelector={setShowDocumentSelector}
              handleDocumentSelect={(doc) => setSelectedDocument(doc)}
              handleUploadComplete={() => toast({ title: "Success", description: "Document uploaded successfully" })}
            />
            <div className="flex gap-2 items-center">
              <AIFormattingDialog 
                onConfigSubmit={() => {}}
                disabled={!selectedDocument}
              />
              <div className="relative">
                {hasFormattedDocument && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                )}
                <ExportOptionsDialog 
                  documentId={selectedDocument?.id}
                  disabled={!hasFormattedDocument}
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="print" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="mb-4">
              <TabsTrigger value="print">Print Preview</TabsTrigger>
              <TabsTrigger value="digital">Digital Devices</TabsTrigger>
            </TabsList>

            <TabsContent value="print" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoomLevel(Math.min(zoomLevel + 10, 200))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Slider
                    value={[zoomLevel]}
                    onValueChange={handleZoomChange}
                    min={50}
                    max={200}
                    step={10}
                    className="w-32"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoomLevel(Math.max(zoomLevel - 10, 50))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-100 p-8 rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
                <div className="bg-white shadow-lg rounded-lg p-8" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
                  <div className="text-center text-sm text-gray-500 mb-2">Left Page</div>
                  {/* Page content */}
                </div>
                <div className="bg-white shadow-lg rounded-lg p-8" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
                  <div className="text-center text-sm text-gray-500 mb-2">Right Page</div>
                  {/* Page content */}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="digital">
              <div className="space-y-4">
                <div className="flex justify-start space-x-4 mb-4">
                  <Button
                    variant={deviceView === 'kindle' ? 'default' : 'outline'}
                    onClick={() => setDeviceView('kindle')}
                  >
                    Kindle
                  </Button>
                  <Button
                    variant={deviceView === 'ipad' ? 'default' : 'outline'}
                    onClick={() => setDeviceView('ipad')}
                  >
                    iPad
                  </Button>
                  <Button
                    variant={deviceView === 'phone' ? 'default' : 'outline'}
                    onClick={() => setDeviceView('phone')}
                  >
                    Phone
                  </Button>
                </div>
                <DevicePreview
                  device={deviceView}
                  content={selectedDocument?.content || ''}
                  zoomLevel={zoomLevel}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Manual Mode Coming Soon Alert */}
      <AlertDialog open={showManualModeAlert} onOpenChange={setShowManualModeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Manual Mode Coming Soon</AlertDialogTitle>
            <AlertDialogDescription>
              The manual formatting mode is currently under development and will be available soon. For now, please use our AI assistant to help you format your book.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <AlertDialogAction onClick={() => setShowManualModeAlert(false)}>
              Got it
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
