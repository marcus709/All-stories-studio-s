import { IText } from "fabric";
import { Template } from "@/types/book";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  Type,
  ArrowUpDown,
  ArrowLeftRight,
  Heading1,
  Heading2
} from "lucide-react";

const FONTS = [
  { name: "Arial", value: "Arial" },
  { name: "Times New Roman", value: "Times New Roman" },
  { name: "Helvetica", value: "Helvetica" },
  { name: "Georgia", value: "Georgia" },
  { name: "Courier New", value: "Courier New" },
  { name: "Instagram Sans Draft", value: "Instagram Sans Draft" }
];

const TEXT_STYLES = [
  { name: "Normal Text", value: "normal" },
  { name: "Header 1", value: "h1" },
  { name: "Header 2", value: "h2" },
  { name: "Footer", value: "footer" },
  { name: "Page Number", value: "page-number" }
];

interface PropertiesPanelProps {
  selectedTemplate: Template | null;
  selectedText?: IText | null;
}

export const PropertiesPanel = ({ selectedTemplate, selectedText }: PropertiesPanelProps) => {
  const updateSelectedText = (property: string, value: string | number) => {
    if (!selectedText) return;

    switch (property) {
      case "font":
        selectedText.set("fontFamily", value);
        break;
      case "size":
        selectedText.set("fontSize", Number(value));
        break;
      case "color":
        selectedText.set("fill", value);
        break;
      case "align":
        selectedText.set("textAlign", value);
        break;
      case "bold":
        selectedText.set("fontWeight", selectedText.fontWeight === "bold" ? "normal" : "bold");
        break;
      case "italic":
        selectedText.set("fontStyle", selectedText.fontStyle === "italic" ? "normal" : "italic");
        break;
      case "underline":
        selectedText.set("underline", !selectedText.underline);
        break;
      case "lineHeight":
        selectedText.set("lineHeight", Number(value));
        break;
      case "letterSpacing":
        selectedText.set("charSpacing", Number(value));
        break;
    }

    selectedText.canvas?.renderAll();
  };

  if (selectedText) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Text Properties</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select 
                  value={selectedText.fontFamily || undefined}
                  onValueChange={(value) => updateSelectedText("font", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <Input
                  type="number"
                  min="8"
                  max="80"
                  value={selectedText.fontSize}
                  onChange={(e) => updateSelectedText("size", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Line Height</Label>
              <div className="flex items-center gap-4">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
                <Slider
                  value={[selectedText.lineHeight || 1.2]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={([value]) => updateSelectedText("lineHeight", value)}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">{(selectedText.lineHeight || 1.2).toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Letter Spacing</Label>
              <div className="flex items-center gap-4">
                <ArrowLeftRight className="h-4 w-4 text-gray-500" />
                <Slider
                  value={[selectedText.charSpacing || 0]}
                  min={-20}
                  max={100}
                  step={1}
                  onValueChange={([value]) => updateSelectedText("letterSpacing", value)}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">{selectedText.charSpacing || 0}</span>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={selectedText.fill?.toString() || "#000000"}
                  onChange={(e) => updateSelectedText("color", e.target.value)}
                  className="w-[100px] h-10"
                />
              </div>

              <ToggleGroup type="single" className="flex gap-1">
                <ToggleGroupItem 
                  value="left" 
                  onClick={() => updateSelectedText("align", "left")}
                  data-state={selectedText.textAlign === "left" ? "on" : "off"}
                >
                  <AlignLeft className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="center" 
                  onClick={() => updateSelectedText("align", "center")}
                  data-state={selectedText.textAlign === "center" ? "on" : "off"}
                >
                  <AlignCenter className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="right" 
                  onClick={() => updateSelectedText("align", "right")}
                  data-state={selectedText.textAlign === "right" ? "on" : "off"}
                >
                  <AlignRight className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>

              <ToggleGroup type="multiple" className="flex gap-1">
                <ToggleGroupItem 
                  value="bold" 
                  onClick={() => updateSelectedText("bold", "")}
                  data-state={selectedText.fontWeight === "bold" ? "on" : "off"}
                >
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="italic" 
                  onClick={() => updateSelectedText("italic", "")}
                  data-state={selectedText.fontStyle === "italic" ? "on" : "off"}
                >
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="underline" 
                  onClick={() => updateSelectedText("underline", "")}
                  data-state={selectedText.underline ? "on" : "off"}
                >
                  <Underline className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4">Properties</h3>
      {selectedTemplate ? (
        <div className="space-y-4">
          <div>
            <Label>Template Name</Label>
            <p className="text-gray-600">{selectedTemplate.name}</p>
          </div>
          <div>
            <Label>Genre</Label>
            <p className="text-gray-600">{selectedTemplate.genre}</p>
          </div>
          <div>
            <Label>Colors</Label>
            <div className="flex gap-2 mt-1">
              {selectedTemplate.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Select a template to view properties</p>
      )}
    </div>
  );
};