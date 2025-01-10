import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { X, Type, Search, RotateCcw, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BookFormat {
  name: string;
  printSizes: string[];
  digitalFormats: string[];
  margins: string;
  fontSizes: string[];
}

const BOOK_FORMATS: Record<string, BookFormat> = {
  "trade-paperback": {
    name: "Trade Paperback",
    printSizes: ["5\" x 8\"", "5.5\" x 8.5\"", "6\" x 9\""],
    digitalFormats: ["EPUB", "MOBI", "PDF"],
    margins: "0.75in",
    fontSizes: ["11pt", "12pt", "13pt"]
  },
  "mass-market": {
    name: "Mass Market",
    printSizes: ["4.25\" x 6.87\""],
    digitalFormats: ["EPUB", "MOBI"],
    margins: "0.5in",
    fontSizes: ["10pt", "11pt"]
  },
  "hardcover": {
    name: "Hardcover",
    printSizes: ["6\" x 9\"", "6.14\" x 9.21\""],
    digitalFormats: ["EPUB", "MOBI"],
    margins: "1in",
    fontSizes: ["12pt", "13pt", "14pt"]
  }
};

interface TextFormattingToolsProps {
  isAIMode: boolean;
  currentSection: string;
  sectionContent?: string;
  onContentChange: (content: string) => void;
}

export const TextFormattingTools = ({ 
  isAIMode, 
  currentSection,
  sectionContent,
  onContentChange
}: TextFormattingToolsProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string>("trade-paperback");
  const [selectedSize, setSelectedSize] = useState<string>(BOOK_FORMATS["trade-paperback"].printSizes[0]);
  const [selectedDigitalFormat, setSelectedDigitalFormat] = useState<string>(BOOK_FORMATS["trade-paperback"].digitalFormats[0]);
  const [deviceView, setDeviceView] = useState<'print' | 'kindle' | 'ipad' | 'phone'>('print');
  const [fontSize, setFontSize] = useState<string>(BOOK_FORMATS["trade-paperback"].fontSizes[0]);
  const [isFormatSettingsOpen, setIsFormatSettingsOpen] = useState(true);
  const [editableContent, setEditableContent] = useState(sectionContent || '');

  useEffect(() => {
    setEditableContent(sectionContent || '');
  }, [sectionContent]);

  const handleContentChange = (event: React.FormEvent<HTMLDivElement>) => {
    const newContent = event.currentTarget.innerHTML;
    setEditableContent(newContent);
    onContentChange(newContent);
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
    const format = BOOK_FORMATS[selectedFormat];
    const baseStyles = {
      padding: format.margins,
      fontSize: fontSize,
      lineHeight: '1.6',
      fontFamily: '"Times New Roman", serif',
      color: '#1a1a1a',
      textAlign: 'left' as const,
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
      maxWidth: '100%',
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      margin: '0 auto',
      minHeight: '90%',
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

  return (
    <div className="flex-1 flex">
      <div className="w-[21cm] mx-auto my-4 overflow-hidden flex-1">
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
                  dangerouslySetInnerHTML={{ 
                    __html: editableContent
                  }}
                  onInput={handleContentChange}
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
                  onValueChange={(value) => {
                    setSelectedFormat(value);
                    setSelectedSize(BOOK_FORMATS[value].printSizes[0]);
                    setSelectedDigitalFormat(BOOK_FORMATS[value].digitalFormats[0]);
                    setFontSize(BOOK_FORMATS[value].fontSizes[0]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose format" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BOOK_FORMATS).map(([key, format]) => (
                      <SelectItem key={key} value={key}>
                        {format.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Print Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose size" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOK_FORMATS[selectedFormat].printSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Font Size</label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose font size" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOK_FORMATS[selectedFormat].fontSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Digital Format</label>
                <Select value={selectedDigitalFormat} onValueChange={setSelectedDigitalFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose format" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOK_FORMATS[selectedFormat].digitalFormats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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