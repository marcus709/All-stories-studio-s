import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Template } from "@/types/book";
import { IText } from "fabric";
import { TextFormattingTools } from "./book/TextFormattingTools";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { AIFormattingDialog } from "./book/AIFormattingDialog";
import { DocumentSelector } from "./book/DocumentSelector";
import { ExportOptionsDialog } from "./book/ExportOptionsDialog";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useStory } from "@/contexts/StoryContext";
import { Document } from "@/types/story";

export const FormattingView = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState("templates");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [previewScene, setPreviewScene] = useState("none");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [coverTexts, setCoverTexts] = useState<Array<{ text: string; font: string; size: number; x: number; y: number }>>([]);
  const [selectedText, setSelectedText] = useState<IText | null>(null);
  const [deviceView, setDeviceView] = useState<'print' | 'kindle' | 'ipad' | 'phone'>('print');
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string }>>([]);
  const [isAIMode, setIsAIMode] = useState(true);
  const [showManualModeAlert, setShowManualModeAlert] = useState(false);
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [hasFormattedDocument, setHasFormattedDocument] = useState(false);
  const { toast } = useToast();
  const { selectedStory } = useStory();

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

  const handleFormatConfig = async (config: any) => {
    if (!selectedDocument) {
      toast({
        title: "No document selected",
        description: "Please select a document to format",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate formatting process
      toast({
        title: "Formatting document",
        description: "Please wait while we format your document...",
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      setHasFormattedDocument(true);
      toast({
        title: "Document formatted",
        description: "Your document has been formatted successfully. Click the Export button to download.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to format document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleResetDesign = () => {
    setSelectedTemplate(null);
    setCoverImage(null);
    setHasFormattedDocument(false);
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

  const handleAIModeToggle = (checked: boolean) => {
    if (!checked) {
      setShowManualModeAlert(true);
    }
  };

  const handleDocumentSelect = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    setSelectedDocument(doc || null);
    setShowDocumentSelector(false);
    setHasFormattedDocument(false);
    
    toast({
      title: "Document selected",
      description: `Selected "${doc?.title}". Configure formatting options to proceed.`,
    });
  };

  const handleUploadComplete = () => {
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
    setShowDocumentSelector(false);
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
              onCheckedChange={handleAIModeToggle}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Always AI Mode */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto h-full bg-white/40 backdrop-blur-md rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] border border-gray-200/60">
          <div className="flex justify-between mb-4">
            <DocumentSelector
              documents={documents}
              showDocumentSelector={showDocumentSelector}
              setShowDocumentSelector={setShowDocumentSelector}
              handleDocumentSelect={handleDocumentSelect}
              handleUploadComplete={handleUploadComplete}
            />
            <div className="flex gap-2 items-center">
              <AIFormattingDialog 
                onConfigSubmit={handleFormatConfig}
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
          <TextFormattingTools isAIMode={true} />
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