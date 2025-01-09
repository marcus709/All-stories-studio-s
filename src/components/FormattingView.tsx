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
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

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

  const handleFormatConfig = (config: any) => {
    console.log("Format config:", config);
    // Here you would implement the logic to apply the formatting
  };

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

  const handleAIModeToggle = (checked: boolean) => {
    if (!checked) {
      setShowManualModeAlert(true);
    }
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
          <div className="flex justify-end mb-4">
            <AIFormattingDialog onConfigSubmit={handleFormatConfig} />
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