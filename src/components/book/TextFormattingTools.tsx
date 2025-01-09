import { Bold, Italic, Underline, AlignLeft, AlignRight, AlignJustify, List, ListOrdered } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface TextFormattingToolsProps {
  isAIMode: boolean;
}

export const TextFormattingTools = ({ isAIMode }: TextFormattingToolsProps) => {
  if (isAIMode) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b">
        <div className="flex items-center gap-1">
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
        
        <div className="flex items-center gap-1">
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
        
        <div className="flex items-center gap-1">
          <Toggle aria-label="Bullet list">
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Numbered list">
            <ListOrdered className="h-4 w-4" />
          </Toggle>
        </div>
        
        <Select defaultValue="palatino">
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="palatino">Palatino</SelectItem>
            <SelectItem value="times">Times New Roman</SelectItem>
            <SelectItem value="georgia">Georgia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-8 bg-gray-50">
        <div className="grid grid-cols-2 gap-8 h-full max-w-[1400px] mx-auto">
          {/* Editor */}
          <div className="relative">
            <div 
              className="absolute inset-0 bg-white rounded-lg shadow-lg overflow-hidden"
              style={{
                width: '595px',   // A4 width
                height: '842px',  // A4 height
                margin: '0 auto'
              }}
            >
              <div 
                contentEditable 
                className="h-full p-8 focus:outline-none focus:ring-0 prose max-w-none"
                style={{
                  fontFamily: 'Palatino, serif'
                }}
              >
                <h1>The Cry In The Corridor</h1>
                <p>At first each day which passed by for Mary Lennox was exactly like the others. Every morning she awoke in her tapestried room and found Martha kneeling upon the hearth building her fire; every morning she ate her breakfast in the nursery which had nothing amusing in it...</p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="relative">
            <div 
              className="absolute inset-0 bg-white rounded-lg shadow-lg overflow-hidden"
              style={{
                width: '595px',   // A4 width
                height: '842px',  // A4 height
                margin: '0 auto'
              }}
            >
              <div className="h-full p-8 prose max-w-none">
                <h1>The Cry In The Corridor</h1>
                <p>Preview will appear here...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};