import { Bold, Italic, Underline, AlignLeft, AlignRight, AlignJustify, List, Timer, RotateCcw, RotateCw, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TextFormattingToolsProps {
  isAIMode: boolean;
}

export const TextFormattingTools = ({ isAIMode }: TextFormattingToolsProps) => {
  if (isAIMode) {
    return null;
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center space-x-2 p-2 bg-white rounded-md border border-gray-200">
        <div className="flex items-center space-x-1">
          <Toggle aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle underline">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center space-x-1">
          <Toggle aria-label="Align left">
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Align center">
            <AlignJustify className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Align right">
            <AlignRight className="h-4 w-4" />
          </Toggle>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center space-x-1">
          <Toggle aria-label="Bullet list">
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Numbered list">
            <ListOrdered className="h-4 w-4" />
          </Toggle>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-xs">
            <Timer className="h-4 w-4 mr-1" />
            300 words
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Export docx
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0 px-12">
        <div className="flex flex-col space-y-4 min-h-0">
          <div className="prose max-w-none flex-1 bg-white rounded-lg shadow-lg">
            <div 
              contentEditable 
              className="h-full p-8 focus:outline-none focus:ring-0 prose-h1:text-3xl prose-h2:text-2xl prose-p:text-base prose-p:leading-relaxed"
              style={{
                minHeight: '842px',  // A4 height ratio
                maxWidth: '595px',   // A4 width ratio
                margin: '0 auto',
                backgroundColor: 'white',
              }}
            >
              <h1>Chapter 1</h1>
              <h2>There Is No One Left</h2>
              <p>Start writing your content here...</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 min-h-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Select defaultValue="ipad">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ipad">iPad</SelectItem>
                  <SelectItem value="kindle">Kindle</SelectItem>
                  <SelectItem value="print">Print</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="palatino">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="palatino">Palatino</SelectItem>
                  <SelectItem value="times">Times New Roman</SelectItem>
                  <SelectItem value="georgia">Georgia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow-lg flex-1 overflow-hidden"
            style={{
              minHeight: '842px',  // A4 height ratio
              maxWidth: '595px',   // A4 width ratio
              margin: '0 auto',
            }}
          >
            <div className="h-full p-8 prose max-w-none">
              <h1>Chapter 1</h1>
              <h2>There Is No One Left</h2>
              <p>Preview will appear here...</p>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline">← Chapter</Button>
            <Button variant="outline">Chapter →</Button>
          </div>
        </div>
      </div>
    </div>
  );
};