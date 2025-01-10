import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronDown, ChevronUp, AlertCircle, X, Smartphone, Tablet, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOK_SIZES, DIGITAL_FORMATS, FORMAT_SIZES, BookSize } from "@/lib/formatting-constants";
import { getPreviewStyles } from "@/lib/preview-constants";
import { useToast } from "@/hooks/use-toast";

interface TextFormattingToolsProps {
  isAIMode: boolean;
  currentSection: string;
  sectionContent?: string;
  onContentChange: (content: string) => void;
  onBookSizeChange: (size: BookSize) => void;
  onDeviceSettingsChange: (settings: any) => void;
}

export const TextFormattingTools = ({ 
  isAIMode, 
  currentSection,
  sectionContent,
  onContentChange,
  onBookSizeChange,
  onDeviceSettingsChange
}: TextFormattingToolsProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'kdp' | 'ingramSpark'>('kdp');
  const [selectedFormat, setSelectedFormat] = useState<'print' | 'digital'>('print');
  const [selectedSize, setSelectedSize] = useState<string>('6x9');
  const [deviceView, setDeviceView] = useState<'print' | 'kindle' | 'ipad' | 'phone'>('print');
  const [fontSize, setFontSize] = useState<string>("12pt");
  const [isFormatSettingsOpen, setIsFormatSettingsOpen] = useState(true);
  const [editableContent, setEditableContent] = useState(sectionContent || '');
  const [showPlatformAlert, setShowPlatformAlert] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setEditableContent(sectionContent || '');
  }, [sectionContent]);

  const handlePlatformChange = (platform: 'kdp' | 'ingramSpark') => {
    setSelectedPlatform(platform);
    setSelectedFormat('print');
    setSelectedSize(platform === 'kdp' ? '6x9' : '5x8');
    
    toast({
      title: `${platform === 'kdp' ? 'Amazon KDP' : 'IngramSpark'} Selected`,
      description: platform === 'kdp' 
        ? "Using Amazon KDP specifications for formatting"
        : "Using IngramSpark specifications for formatting",
    });
  };

  const handleFormatChange = (format: 'print' | 'digital') => {
    setSelectedFormat(format);
    if (format === 'digital') {
      setDeviceView('kindle');
    } else {
      setDeviceView('print');
      setSelectedSize('6x9');
    }
  };

  const getSectionTitle = (section: string) => {
    if (!section) return 'Content';
    
    if (section === 'title') return 'Title Page';
    if (section === 'copyright') return 'Copyright Page';
    if (section === 'dedication') return 'Dedication';
    if (section === 'contents') return 'Table of Contents';
    if (section.startsWith('chapter-')) return `Chapter ${section.split('-')[1]}`;
    
    return 'Content';
  };

  const getDeviceFrame = () => {
    if (deviceView === 'kindle') {
      return {
        frame: "relative w-[600px] mx-auto",
        screen: "aspect-[3/4] overflow-hidden",
        text: "font-['Bookerly',Georgia,serif] text-[#333] leading-relaxed px-6 py-4 bg-[#f6f6f6]"
      };
    } else if (deviceView === 'ipad') {
      return {
        frame: "rounded-2xl border-[24px] border-gray-700 bg-white shadow-xl max-w-[768px] mx-auto",
        screen: "aspect-[4/3] overflow-hidden",
        text: "font-['SF Pro Display',system-ui,sans-serif] text-black leading-relaxed px-8 py-6"
      };
    } else if (deviceView === 'phone') {
      return {
        frame: "rounded-[32px] border-[12px] border-gray-900 bg-white shadow-xl max-w-[320px] mx-auto",
        screen: "aspect-[9/19.5] overflow-hidden",
        text: "font-['SF Pro Text',system-ui,sans-serif] text-black leading-relaxed px-4 py-3"
      };
    }
    return {
      frame: "rounded-none border border-gray-200 bg-white shadow-lg",
      screen: "aspect-[1/1.414] overflow-hidden",
      text: "font-serif text-black leading-relaxed px-8 py-6"
    };
  };

  const deviceStyles = getDeviceFrame();

  return (
    <div className="flex-1 flex">
      <div className="w-[50%] mx-auto my-4 overflow-auto">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-2xl font-serif mb-6">
              {getSectionTitle(currentSection)}
            </h2>
            <div 
              contentEditable
              suppressContentEditableWarning
              className="focus:outline-none min-h-[calc(100vh-16rem)] font-serif"
              dangerouslySetInnerHTML={{ __html: editableContent }}
              onInput={(e) => {
                const content = e.currentTarget.innerHTML;
                setEditableContent(content);
                onContentChange(content);
              }}
            />
          </div>
        </ScrollArea>
      </div>

      <div className="w-[350px] border-l flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <Collapsible
          open={isFormatSettingsOpen}
          onOpenChange={setIsFormatSettingsOpen}
          className="border-b"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Format Settings</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isFormatSettingsOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Publishing Platform</label>
                <Select 
                  value={selectedPlatform}
                  onValueChange={(value: 'kdp' | 'ingramSpark') => handlePlatformChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kdp">Amazon KDP</SelectItem>
                    <SelectItem value="ingramSpark">IngramSpark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Preview Device</label>
                <Select value={deviceView} onValueChange={(value: 'print' | 'kindle' | 'ipad' | 'phone') => {
                  setDeviceView(value);
                  if (value !== 'print') {
                    setSelectedFormat('digital');
                  } else {
                    setSelectedFormat('print');
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(deviceView)}
                        <span>
                          {deviceView === 'print' ? 'Print Preview' :
                           deviceView === 'kindle' ? 'Kindle E-reader' :
                           deviceView === 'ipad' ? 'iPad/Tablet' :
                           'Phone'}
                        </span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="print">
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4" />
                        <span>Print Preview</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="kindle">
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4" />
                        <span>Kindle E-reader</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ipad">
                      <div className="flex items-center gap-2">
                        <Tablet className="h-4 w-4" />
                        <span>iPad/Tablet</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span>Phone</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Format Type</label>
                <Select 
                  value={selectedFormat}
                  onValueChange={(value: 'print' | 'digital') => handleFormatChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="print">Print Book</SelectItem>
                    {selectedPlatform === 'kdp' && (
                      <SelectItem value="digital">Digital (Kindle)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedFormat === 'print' && (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Trim Size</label>
                  <Select 
                    value={selectedSize} 
                    onValueChange={setSelectedSize}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose size" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedPlatform === 'kdp' ? (
                        <>
                          <SelectItem value="5x8">5" x 8" (Novel)</SelectItem>
                          <SelectItem value="6x9">6" x 9" (Standard)</SelectItem>
                          <SelectItem value="8.5x11">8.5" x 11" (Textbook)</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="5x8">5" x 8" (Novel)</SelectItem>
                          <SelectItem value="6x9">6" x 9" (Standard)</SelectItem>
                          <SelectItem value="8.5x8.5">8.5" x 8.5" (Square)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                className="w-full"
                onClick={() => {
                  setIsFormatSettingsOpen(false);
                  onDeviceSettingsChange({
                    platform: selectedPlatform,
                    format: selectedFormat,
                    size: selectedSize,
                    deviceView,
                    fontSize
                  });
                }}
              >
                Save Format Settings
              </Button>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <div className="flex-1 overflow-auto p-4">
          {deviceView === 'kindle' ? (
            <div className="relative w-full max-w-[600px] mx-auto">
              <img 
                src="/lovable-uploads/ef6d596d-15fc-4a39-9bcd-9fccb852f98c.png" 
                alt="Kindle mockup"
                className="w-full h-auto"
              />
              <div className="absolute inset-[12%] bg-[#f6f6f6] overflow-y-auto">
                <div 
                  className="prose prose-sm max-w-none p-4 font-['Bookerly',Georgia,serif] text-[#333] leading-relaxed"
                  style={getPreviewStyles(selectedPlatform, selectedFormat, selectedSize, deviceView)}
                  dangerouslySetInnerHTML={{ __html: editableContent }}
                />
              </div>
            </div>
          ) : (
            <div className={cn(
              "relative transition-all duration-300",
              deviceStyles.frame
            )}>
              <div className={deviceStyles.screen}>
                <div 
                  className={cn(
                    deviceStyles.text,
                    "preview-container"
                  )}
                  style={getPreviewStyles(selectedPlatform, selectedFormat, selectedSize, deviceView)}
                >
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: editableContent }}
                  />
                </div>
              </div>
              {deviceView === 'phone' && (
                <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[80px] h-[6px] bg-black rounded-full" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
