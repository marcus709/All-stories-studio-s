import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Template } from "@/types/book";
import { IText } from "fabric";
import { TextFormattingTools } from "./book/TextFormattingTools";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { AIFormattingDialog } from "./book/AIFormattingDialog";

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
  const [isAIMode, setIsAIMode] = useState(false);

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

  return (
    <div className="min-h-screen bg-white/90 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-16 border-b border-gray-200/60 bg-white/50 backdrop-blur-sm flex items-center px-6 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              {isAIMode ? <ToggleRight className="h-5 w-5 text-purple-500" /> : <ToggleLeft className="h-5 w-5 text-gray-500" />}
              <Label htmlFor="ai-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                AI Assistant
              </Label>
            </div>
            <Switch
              id="ai-mode"
              checked={isAIMode}
              onCheckedChange={setIsAIMode}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isAIMode ? (
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto h-full bg-white/40 backdrop-blur-md rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] border border-gray-200/60">
            <div className="flex justify-end mb-4">
              <AIFormattingDialog onConfigSubmit={handleFormatConfig} />
            </div>
            <TextFormattingTools isAIMode={isAIMode} />
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 grid grid-cols-12 gap-6">
          {/* Left Tools Panel */}
          <div className="col-span-3 bg-white/40 backdrop-blur-md rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] border border-gray-200/60">
            <TextFormattingTools isAIMode={isAIMode} />
          </div>

          {/* Center Book Preview */}
          <div className="col-span-6 bg-white/40 backdrop-blur-md rounded-lg p-4 flex flex-col shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] border border-gray-200/60">
            <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60 relative perspective-[2000px] flex items-center justify-center">
              {/* 3D Book Preview */}
              <div className="w-[600px] h-[400px] transform-style-3d transition-all duration-500 cursor-pointer relative">
                {/* Book Container */}
                <div className="absolute inset-0 transform-style-3d rotate-x-[20deg] rotate-y-[-20deg]">
                  {/* Left Page (verso) */}
                  <div className="absolute left-0 w-[290px] h-full bg-white rounded-l-lg shadow-lg transform origin-right transition-transform">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100/80 to-transparent" />
                    <div className="absolute inset-[16px] flex flex-col">
                      <div className="text-gray-600 text-sm leading-relaxed">
                        Left page content goes here. This is where the previous page content will be displayed.
                      </div>
                    </div>
                    {/* Page Curl Shadow */}
                    <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-black/10 to-transparent transform skew-y-3" />
                  </div>

                  {/* Book Gutter */}
                  <div className="absolute left-1/2 -translate-x-[4px] inset-y-0 w-[8px] bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 transform-gpu">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent" />
                  </div>

                  {/* Right Page (recto) */}
                  <div className="absolute right-0 w-[290px] h-full bg-white rounded-r-lg shadow-lg transform origin-left transition-transform">
                    <div className="absolute inset-0 bg-gradient-to-l from-gray-100/80 to-transparent" />
                    <div className="absolute inset-[16px] flex flex-col">
                      <div className="text-gray-600 text-sm leading-relaxed">
                        Right page content goes here. This is where the current page content will be displayed.
                      </div>
                    </div>
                    {/* Page Curl Shadow */}
                    <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-black/10 to-transparent transform -skew-y-3" />
                  </div>

                  {/* Page Edges */}
                  <div className="absolute -right-1 inset-y-0 w-1 bg-gradient-to-l from-gray-200 to-gray-300 transform translate-x-full">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 bg-white border-t border-gray-300"
                        style={{ height: '1px', top: `${(i * 5)}%` }}
                      />
                    ))}
                  </div>
                  <div className="absolute -left-1 inset-y-0 w-1 bg-gradient-to-r from-gray-200 to-gray-300 transform -translate-x-full">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 bg-white border-t border-gray-300"
                        style={{ height: '1px', top: `${(i * 5)}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Book Shadow */}
                <div className="absolute -bottom-8 inset-x-8 h-[32px] bg-black/20 blur-xl rounded-full transform-gpu scale-95" />
              </div>
            </div>
            
            {/* Bottom Controls */}
            <div className="h-32 mt-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
              {/* Control buttons will be added here */}
            </div>
          </div>

          {/* Right Settings Panel */}
          <div className="col-span-3 bg-white/40 backdrop-blur-md rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] border border-gray-200/60">
            {/* Settings will be added here */}
          </div>
        </div>
      )}
    </div>
  );
};
