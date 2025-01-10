import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Template } from "@/types/book";
import { TextFormattingTools } from "./book/TextFormattingTools";
import { Switch } from "@/components/ui/switch";
import { AIFormattingDialog } from "./book/AIFormattingDialog";
import { DocumentSelector } from "./book/DocumentSelector";
import { ExportOptionsDialog } from "./book/ExportOptionsDialog";
import { FormattingSidebar } from "./book/FormattingSidebar";
import { useToast } from "@/hooks/use-toast";
import { useStory } from "@/contexts/StoryContext";
import { Document } from "@/types/story";
import { Wand2 } from "lucide-react";
import { IText } from "fabric";
import { BookSize } from "@/lib/formatting-constants";

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
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [hasFormattedDocument, setHasFormattedDocument] = useState(false);
  const [currentSection, setCurrentSection] = useState("content");
  const [currentSectionContent, setCurrentSectionContent] = useState<string | undefined>();
  const { toast } = useToast();
  const { selectedStory } = useStory();
  const [currentContent, setCurrentContent] = useState<string>('');
  const [selectedBookSize, setSelectedBookSize] = useState<BookSize | null>(null);
  const [deviceSettings, setDeviceSettings] = useState<any>(null);

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
      toast({
        title: "Formatting document",
        description: "Please wait while we format your document...",
      });

      const { data, error } = await supabase.functions.invoke('format-document', {
        body: { 
          documentId: selectedDocument.id,
          config: config,
          content: selectedDocument.content
        }
      });

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('documents')
        .update({ content: data.formattedContent })
        .eq('id', selectedDocument.id);

      if (updateError) throw updateError;

      setHasFormattedDocument(true);
      toast({
        title: "Document formatted",
        description: "Your document has been formatted successfully. Click the Export button to download.",
      });
    } catch (error) {
      console.error("Formatting error:", error);
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
    setIsAIMode(checked);
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

  const handleSectionSelect = (section: string, content?: string) => {
    setCurrentSection(section);
    setCurrentSectionContent(content);
  };

  const handleContentChange = (content: string) => {
    setCurrentContent(content);
  };

  const handleBookSizeChange = (size: BookSize) => {
    setSelectedBookSize(size);
  };

  const handleDeviceSettingsChange = (settings: any) => {
    setDeviceSettings(settings);
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-white/90 flex flex-col">
      <div className="h-10 px-4 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-gray-200/60">
        <DocumentSelector
          documents={documents}
          showDocumentSelector={showDocumentSelector}
          setShowDocumentSelector={setShowDocumentSelector}
          handleDocumentSelect={handleDocumentSelect}
          handleUploadComplete={handleUploadComplete}
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Switch
              id="ai-mode"
              checked={isAIMode}
              onCheckedChange={handleAIModeToggle}
              className="data-[state=checked]:bg-purple-500 h-4 w-7"
            />
            <Wand2 className="h-3 w-3 text-purple-500" />
          </div>
          {isAIMode && (
            <AIFormattingDialog 
              onConfigSubmit={handleFormatConfig}
              disabled={!selectedDocument}
            />
          )}
          <div className="relative">
            {hasFormattedDocument && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            )}
            <ExportOptionsDialog 
              documentId={selectedDocument?.id}
              disabled={!hasFormattedDocument}
              bookSize={selectedBookSize}
              deviceSettings={deviceSettings}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <FormattingSidebar 
          document={selectedDocument}
          onSectionSelect={handleSectionSelect}
          currentContent={currentContent}
        />
        <TextFormattingTools 
          isAIMode={isAIMode}
          currentSection={currentSection}
          sectionContent={currentSectionContent}
          onContentChange={handleContentChange}
          onBookSizeChange={handleBookSizeChange}
          onDeviceSettingsChange={handleDeviceSettingsChange}
        />
      </div>
    </div>
  );
};
