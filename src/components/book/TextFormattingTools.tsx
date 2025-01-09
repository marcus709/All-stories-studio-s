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
  currentSection = 'content',
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
    return {
      padding: format.margins,
      fontSize: fontSize,
      maxWidth: deviceView === 'phone' ? '320px' : 
                deviceView === 'kindle' ? '500px' :
                deviceView === 'ipad' ? '768px' : '100%',
      margin: '0 auto'
    };
  };

  return (
    <div className="flex-1 flex">
      <div className="w-[21cm] mx-auto bg-white shadow-lg my-4 rounded-lg overflow-hidden border">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="p-8" style={getPreviewStyle()}>
            <h2 className="text-2xl font-semibold mb-4">
              {getSectionTitle(currentSection)}
            </h2>
            <div className="prose max-w-none">
              <div 
                contentEditable
                suppressContentEditableWarning
                className="focus:outline-none min-h-[200px]"
                dangerouslySetInnerHTML={{ 
                  __html: editableContent
                }}
                onInput={handleContentChange}
              />
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
            "aspect-[3/4] bg-white rounded-lg border shadow-lg relative",
            deviceView === 'phone' ? 'max-w-[320px] mx-auto' :
            deviceView === 'kindle' ? 'max-w-[500px] mx-auto' :
            deviceView === 'ipad' ? 'max-w-[768px] mx-auto' :
            'w-full'
          )}>
            <div className="absolute inset-0 m-8" style={getPreviewStyle()}>
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
