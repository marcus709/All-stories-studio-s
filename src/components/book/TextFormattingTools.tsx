import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Type, Search, RotateCcw, Quote } from "lucide-react";
import { useState } from "react";

interface BookFormat {
  name: string;
  printSizes: string[];
  digitalFormats: string[];
}

const BOOK_FORMATS: Record<string, BookFormat> = {
  "trade-paperback": {
    name: "Trade Paperback",
    printSizes: ["5\" x 8\"", "5.5\" x 8.5\"", "6\" x 9\""],
    digitalFormats: ["EPUB", "MOBI", "PDF"]
  },
  "mass-market": {
    name: "Mass Market",
    printSizes: ["4.25\" x 6.87\""],
    digitalFormats: ["EPUB", "MOBI"]
  },
  "hardcover": {
    name: "Hardcover",
    printSizes: ["6\" x 9\"", "6.14\" x 9.21\""],
    digitalFormats: ["EPUB", "MOBI"]
  },
  "photo-art": {
    name: "Photo/Art Books",
    printSizes: ["8\" x 10\"", "8.5\" x 8.5\"", "11\" x 8.5\""],
    digitalFormats: ["PDF (Fixed Layout)"]
  },
  "childrens": {
    name: "Children's Books",
    printSizes: ["8\" x 8\"", "8.5\" x 11\""],
    digitalFormats: ["EPUB"]
  },
  "academic": {
    name: "Academic/Textbooks",
    printSizes: ["7\" x 10\"", "8.5\" x 11\""],
    digitalFormats: ["PDF"]
  }
};

interface TextFormattingToolsProps {
  isAIMode: boolean;
  currentSection: string;
  sectionContent?: string;
}

export const TextFormattingTools = ({ 
  isAIMode, 
  currentSection = 'content',
  sectionContent
}: TextFormattingToolsProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string>("trade-paperback");
  const [selectedSize, setSelectedSize] = useState<string>(BOOK_FORMATS["trade-paperback"].printSizes[0]);
  const [selectedDigitalFormat, setSelectedDigitalFormat] = useState<string>(BOOK_FORMATS["trade-paperback"].digitalFormats[0]);
  const [deviceView, setDeviceView] = useState<'print' | 'kindle' | 'ipad' | 'phone'>('print');

  const getSectionTitle = (section: string) => {
    if (!section) return 'Content';
    
    if (section === 'title') return 'Title Page';
    if (section === 'copyright') return 'Copyright Page';
    if (section === 'dedication') return 'Dedication';
    if (section === 'contents') return 'Table of Contents';
    if (section.startsWith('chapter-')) return `Chapter ${section.split('-')[1]}`;
    
    return 'Content';
  };

  return (
    <div className="flex-1 flex">
      <div className="w-[21cm] mx-auto bg-white shadow-lg my-4 rounded-lg overflow-hidden border">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">
            {getSectionTitle(currentSection)}
          </h2>
          <div className="prose max-w-none">
            <div 
              contentEditable
              suppressContentEditableWarning
              className="focus:outline-none min-h-[200px]"
              dangerouslySetInnerHTML={{ 
                __html: sectionContent ? sectionContent.split('\n').join('<br />') : 'Edit your content here...'
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-[400px] border-l">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Format Settings</h3>
            <X className="h-4 w-4 text-gray-500" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Book Format</label>
              <Select 
                value={selectedFormat} 
                onValueChange={(value) => {
                  setSelectedFormat(value);
                  setSelectedSize(BOOK_FORMATS[value].printSizes[0]);
                  setSelectedDigitalFormat(BOOK_FORMATS[value].digitalFormats[0]);
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
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="ghost" size="icon">
              <Type className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Quote className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className={`aspect-[3/4] bg-white rounded-lg border shadow-lg p-8 relative ${
            deviceView === 'phone' ? 'max-w-[320px] mx-auto' :
            deviceView === 'kindle' ? 'max-w-[500px] mx-auto' :
            deviceView === 'ipad' ? 'max-w-[768px] mx-auto' :
            'w-full'
          }`}>
            <div className="absolute inset-0 m-8">
              <div className="prose prose-sm max-w-none">
                {sectionContent ? (
                  <div dangerouslySetInnerHTML={{ __html: sectionContent.split('\n').join('<br />') }} />
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