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
    <div className="space-y-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="prose max-w-none">
            <div contentEditable className="min-h-[500px] p-4 bg-white rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              Start writing your content here...
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
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
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 aspect-[3/4] flex items-center justify-center">
            <div className="max-w-sm mx-auto">
              Preview will appear here
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline">← Chapter</Button>
            <Button variant="outline">Chapter →</Button>
          </div>
        </div>
      </div>
    </div>
  );
};