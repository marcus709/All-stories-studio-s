import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LineHeight,
  Indent,
  Outdent,
  Columns,
} from "lucide-react";

export const FormattingToolbar = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Text Alignment</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Line Height</Label>
        <div className="flex items-center gap-4">
          <LineHeight className="h-4 w-4 text-gray-500" />
          <Slider defaultValue={[1.5]} max={3} min={1} step={0.1} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Paragraph Spacing</Label>
        <Input type="number" min={0} max={100} defaultValue={16} />
      </div>

      <div className="space-y-2">
        <Label>Margins</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Top</Label>
            <Input type="number" min={0} max={100} defaultValue={20} />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <Input type="number" min={0} max={100} defaultValue={20} />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <Input type="number" min={0} max={100} defaultValue={20} />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <Input type="number" min={0} max={100} defaultValue={20} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Indentation</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Indent className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Outdent className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Columns</Label>
        <div className="flex items-center gap-4">
          <Columns className="h-4 w-4 text-gray-500" />
          <Input type="number" min={1} max={3} defaultValue={1} />
        </div>
      </div>
    </div>
  );
};