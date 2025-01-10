import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
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
  const { toast } = useToast();

  useEffect(() => {
    setEditableContent(sectionContent || '');
  }, [sectionContent]);

  const handlePlatformChange = (platform: 'kdp' | 'ingramSpark') => {
    setSelectedPlatform(platform);
    // Reset format and size based on platform selection
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
    // Reset size based on format
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

  const getPreviewStyle = () => {
    const selectedSizeObj = BOOK_SIZES.find(size => size.name === selectedSize);
    const baseStyles: React.CSSProperties = {
      padding: '1rem',
      fontSize: fontSize,
      lineHeight: '1.6',
      fontFamily: '"Times New Roman", serif',
      color: '#1a1a1a',
      textAlign: 'left',
    };

    if (deviceView === 'kindle') {
      return {
        ...baseStyles,
        maxWidth: '500px',
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        margin: '0 auto',
        minHeight: '90%',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
      };
    } else if (deviceView === 'ipad') {
      return {
        ...baseStyles,
        maxWidth: '768px',
        backgroundColor: '#ffffff',
        padding: '3rem',
        margin: '0 auto',
        minHeight: '90%',
      };
    } else if (deviceView === 'phone') {
      return {
        ...baseStyles,
        maxWidth: '320px',
        backgroundColor: '#ffffff',
        padding: '1rem',
        margin: '0 auto',
        minHeight: '90%',
      };
    }
    
    return {
      ...baseStyles,
      width: selectedSizeObj ? `${selectedSizeObj.width * 96}px` : '100%',
      height: selectedSizeObj ? `${selectedSizeObj.height * 96}px` : 'auto',
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      margin: '0 auto',
      minHeight: '90%',
      boxSizing: 'border-box' as const,
    };
  };

  const getDeviceFrame = () => {
    if (deviceView === 'kindle') {
      return "rounded-lg border-8 border-gray-800 bg-gray-100 shadow-xl";
    } else if (deviceView === 'ipad') {
      return "rounded-2xl border-[16px] border-gray-700 bg-white shadow-xl";
    } else if (deviceView === 'phone') {
      return "rounded-[32px] border-[12px] border-gray-900 bg-white shadow-xl";
    }
    return "rounded-none border border-gray-200 bg-white shadow-lg";
  };

  const previewStyles = getPreviewStyles(
    selectedPlatform,
    selectedFormat,
    selectedSize,
    deviceView
  );

  return (
    <div className="flex-1 flex">
      <div className="w-[21cm] mx-auto my-4">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {selectedPlatform === 'kdp' 
                ? "Amazon KDP requires specific trim sizes and bleed settings. Preview shows safe areas and bleed zones."
                : "IngramSpark offers more flexibility but requires higher quality PDF submissions with proper bleed settings."}
            </AlertDescription>
          </Alert>

          <div className={cn(
            "relative mx-auto transition-all duration-300",
            "rounded-lg overflow-hidden"
          )}>
            <div style={previewStyles}>
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
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="w-[400px] border-l">
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
            <CollapsibleContent className="space-y-4">
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

              {selectedFormat === 'digital' && (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Preview Device</label>
                  <Select value={deviceView} onValueChange={(value: 'kindle' | 'ipad' | 'phone') => setDeviceView(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kindle">Kindle E-reader</SelectItem>
                      <SelectItem value="ipad">iPad/Tablet</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
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
      </div>
    </div>
  );
};
