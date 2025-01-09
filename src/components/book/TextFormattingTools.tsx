import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Type, Search, RotateCcw, Quote } from "lucide-react";

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
            {sectionContent ? (
              <div dangerouslySetInnerHTML={{ __html: sectionContent.split('\n').join('<br />') }} />
            ) : (
              <p>Edit your {currentSection} content here...</p>
            )}
          </div>
        </div>
      </div>
      <div className="w-[400px] border-l">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Previewer</h3>
            <X className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex gap-2 mb-4">
            <Select defaultValue="ipad">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Choose device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="print">Print</SelectItem>
                <SelectItem value="ipad">iPad</SelectItem>
                <SelectItem value="kindle">Kindle</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="palatino">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Choose font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="palatino">Palatino</SelectItem>
                <SelectItem value="times">Times New Roman</SelectItem>
                <SelectItem value="georgia">Georgia</SelectItem>
                <SelectItem value="garamond">Garamond</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
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
          <div className="aspect-[3/4] bg-white rounded-lg border shadow-lg p-8 relative">
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