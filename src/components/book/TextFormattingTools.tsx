import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOK_SIZES, DIGITAL_FORMATS, FORMAT_SIZES, BookSize } from "@/lib/formatting-constants";

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
  const [selectedFormat, setSelectedFormat] = useState<string>("trade-paperback");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedDigitalFormat, setSelectedDigitalFormat] = useState<string>(DIGITAL_FORMATS[0].name);
  const [deviceView, setDeviceView] = useState<'print' | 'kindle' | 'ipad' | 'phone'>('print');
  const [fontSize, setFontSize] = useState<string>("12pt");
  const [isFormatSettingsOpen, setIsFormatSettingsOpen] = useState(true);
  const [editableContent, setEditableContent] = useState(sectionContent || '');

  useEffect(() => {
    setEditableContent(sectionContent || '');
  }, [sectionContent]);

  useEffect(() => {
    // Reset selected size when format changes and set first available size
    if (selectedFormat in FORMAT_SIZES) {
      const sizes = FORMAT_SIZES[selectedFormat as keyof typeof FORMAT_SIZES];
      setSelectedSize(sizes[0].name);
      onBookSizeChange(sizes[0]);
    } else {
      setSelectedSize("");
      onBookSizeChange(null);
    }
  }, [selectedFormat, onBookSizeChange]);

  const isDigitalFormat = (format: string) => {
    return DIGITAL_FORMATS.some(df => df.name.toLowerCase() === format.toLowerCase());
  };

  const getAvailableSizes = () => {
    if (isDigitalFormat(selectedFormat)) {
      return [];
    }
    return FORMAT_SIZES[selectedFormat as keyof typeof FORMAT_SIZES] || [];
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

  useEffect(() => {
    if (selectedSize) {
      const selectedSizeObj = BOOK_SIZES.find(size => size.name === selectedSize);
      if (selectedSizeObj) {
        onBookSizeChange(selectedSizeObj);
      }
    }
  }, [selectedSize, onBookSizeChange]);

  useEffect(() => {
    onDeviceSettingsChange({
      deviceView,
      fontSize,
      selectedDigitalFormat
    });
  }, [deviceView, fontSize, selectedDigitalFormat, onDeviceSettingsChange]);

  return (
    <div className="flex-1 flex">
      <div className="w-[21cm] mx-auto my-4">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className={cn(
            "relative mx-auto transition-all duration-300 min-h-[calc(100vh-10rem)]",
            getDeviceFrame()
          )}>
            <div className="relative" style={getPreviewStyle()}>
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
                <label className="text-sm text-gray-600 mb-1 block">Book Format</label>
                <Select 
                  value={selectedFormat}
                  onValueChange={setSelectedFormat}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Print Formats</SelectLabel>
                      <SelectItem value="trade-paperback">Trade Paperback</SelectItem>
                      <SelectItem value="mass-market">Mass Market</SelectItem>
                      <SelectItem value="hardcover">Hardcover</SelectItem>
                      <SelectItem value="children">Children's Book</SelectItem>
                      <SelectItem value="photo-book">Photo Book</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Digital Formats</SelectLabel>
                      {DIGITAL_FORMATS.map(format => (
                        <SelectItem key={format.name} value={format.name.toLowerCase()}>
                          {format.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {!isDigitalFormat(selectedFormat) && (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Trim Size</label>
                  <Select value={selectedSize} onValueChange={(value) => {
                    setSelectedSize(value);
                    const size = getAvailableSizes().find(s => s.name === value);
                    if (size) onBookSizeChange(size);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose size" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSizes().map((size) => (
                        <SelectItem key={size.name} value={size.name}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Preview Device</label>
                <Select value={deviceView} onValueChange={(value: 'print' | 'kindle' | 'ipad' | 'phone') => setDeviceView(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="print">Print</SelectItem>
                    <SelectItem value="kindle">Kindle</SelectItem>
                    <SelectItem value="ipad">iPad</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full"
                onClick={() => setIsFormatSettingsOpen(false)}
              >
                Save Format Settings
              </Button>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <div className="p-4">
          <div className={cn(
            "aspect-[3/4] relative transition-all duration-300",
            getDeviceFrame()
          )}>
            <div className="absolute inset-0 m-4" style={getPreviewStyle()}>
              <div className="prose prose-sm max-w-none">
                {editableContent ? (
                  <div dangerouslySetInnerHTML={{ __html: editableContent }} />
                ) : (
                  <div className="text-center text-gray-400">
                    Preview will appear here
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
