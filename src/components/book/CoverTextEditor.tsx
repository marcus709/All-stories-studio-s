import { useEffect, useRef, useState } from "react";
import { Canvas, IText } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  Type,
  Plus,
  ArrowUpDown,
  ArrowLeftRight,
  Heading1,
  Heading2
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CoverTextEditorProps {
  width: number;
  height: number;
  onTextUpdate: (texts: { text: string; font: string; size: number; x: number; y: number }[]) => void;
}

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

export const CoverTextEditor = ({ width, height, onTextUpdate }: CoverTextEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const { toast } = useToast();
  const [selectedObject, setSelectedObject] = useState<IText | null>(null);
  const [textColor, setTextColor] = useState("#000000");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [activeTab, setActiveTab] = useState("typography");

  useEffect(() => {
    if (!canvasRef.current) return;

    fabricRef.current = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "transparent",
    });

    const canvas = fabricRef.current;

    canvas.on("selection:created", (e) => {
      const selected = e.selected?.[0];
      if (selected instanceof IText) {
        setSelectedObject(selected);
        setTextColor(selected.fill as string || "#000000");
        setLineHeight(selected.lineHeight || 1.2);
        setLetterSpacing(selected.charSpacing || 0);
      }
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    canvas.on("text:changed", () => {
      updateTextData();
    });

    canvas.on("object:modified", () => {
      updateTextData();
    });

    // Add initial helper text
    const helperText = new IText("Click 'Add Text' to start editing", {
      left: width / 2,
      top: height / 2,
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#666666",
      originX: "center",
      originY: "center",
      selectable: false,
    });
    canvas.add(helperText);

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  const updateTextData = () => {
    if (!fabricRef.current) return;
    
    const texts = fabricRef.current.getObjects("i-text")
      .filter((obj): obj is IText => obj instanceof IText && obj.selectable !== false)
      .map((textObj) => ({
        text: textObj.text || "",
        font: textObj.fontFamily || "Arial",
        size: textObj.fontSize || 20,
        x: textObj.left || 0,
        y: textObj.top || 0,
      }));

    onTextUpdate(texts);
  };

  const addNewText = (style: string = "normal") => {
    if (!fabricRef.current) return;

    // Remove helper text if it exists
    const helperText = fabricRef.current.getObjects().find(
      (obj): obj is IText => 
        obj instanceof IText && 
        obj.selectable === false
    );
    if (helperText) {
      fabricRef.current.remove(helperText);
    }

    let textConfig: any = {
      left: 50,
      top: 50,
      fontFamily: "Arial",
      fontSize: 20,
      fill: textColor,
      lineHeight: lineHeight,
      charSpacing: letterSpacing,
    };

    // Apply style-specific configurations
    switch (style) {
      case "h1":
        textConfig = {
          ...textConfig,
          fontSize: 32,
          fontWeight: "bold",
          text: "Header 1"
        };
        break;
      case "h2":
        textConfig = {
          ...textConfig,
          fontSize: 24,
          fontWeight: "bold",
          text: "Header 2"
        };
        break;
      case "footer":
        textConfig = {
          ...textConfig,
          fontSize: 12,
          top: height - 50,
          text: "Footer Text"
        };
        break;
      case "page-number":
        textConfig = {
          ...textConfig,
          fontSize: 12,
          top: height - 30,
          left: width - 50,
          text: "1"
        };
        break;
      default:
        textConfig.text = "Your Text Here";
    }

    const text = new IText(textConfig.text, textConfig);

    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    setSelectedObject(text);
    updateTextData();

    toast({
      title: "Text added",
      description: "Double click to edit, drag to move",
    });
  };

  const updateSelectedText = (property: string, value: string | number) => {
    if (!selectedObject || !fabricRef.current) return;

    switch (property) {
      case "font":
        selectedObject.set("fontFamily", value);
        break;
      case "size":
        selectedObject.set("fontSize", Number(value));
        break;
      case "color":
        selectedObject.set("fill", value);
        setTextColor(value as string);
        break;
      case "align":
        selectedObject.set("textAlign", value);
        break;
      case "bold":
        selectedObject.set("fontWeight", selectedObject.fontWeight === "bold" ? "normal" : "bold");
        break;
      case "italic":
        selectedObject.set("fontStyle", selectedObject.fontStyle === "italic" ? "normal" : "italic");
        break;
      case "underline":
        selectedObject.set("underline", !selectedObject.underline);
        break;
      case "lineHeight":
        selectedObject.set("lineHeight", Number(value));
        setLineHeight(Number(value));
        break;
      case "letterSpacing":
        selectedObject.set("charSpacing", Number(value));
        setLetterSpacing(Number(value));
        break;
    }

    fabricRef.current.renderAll();
    updateTextData();
  };

  return (
    <div className="relative w-full h-full">
      <div className="border rounded-lg overflow-hidden bg-white h-full">
        <canvas ref={canvasRef} />
      </div>

      {/* Floating Controls Panel */}
      <div className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="sections">
              <Heading1 className="h-4 w-4 mr-2" />
              Sections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="typography" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Text Editor</h3>
              <Button 
                onClick={() => addNewText()} 
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
                Add Text
              </Button>
            </div>

            {selectedObject && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select 
                      value={selectedObject.fontFamily || undefined}
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
                      value={selectedObject.fontSize}
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
                      value={[lineHeight]}
                      min={1}
                      max={3}
                      step={0.1}
                      onValueChange={([value]) => updateSelectedText("lineHeight", value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">{lineHeight.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Letter Spacing</Label>
                  <div className="flex items-center gap-4">
                    <ArrowLeftRight className="h-4 w-4 text-gray-500" />
                    <Slider
                      value={[letterSpacing]}
                      min={-20}
                      max={100}
                      step={1}
                      onValueChange={([value]) => updateSelectedText("letterSpacing", value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">{letterSpacing}</span>
                  </div>
                </div>

                <div className="flex items-end gap-4">
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => updateSelectedText("color", e.target.value)}
                      className="w-[100px] h-10"
                    />
                  </div>

                  <ToggleGroup type="single" className="flex gap-1">
                    <ToggleGroupItem 
                      value="left" 
                      onClick={() => updateSelectedText("align", "left")}
                      data-state={selectedObject.textAlign === "left" ? "on" : "off"}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="center" 
                      onClick={() => updateSelectedText("align", "center")}
                      data-state={selectedObject.textAlign === "center" ? "on" : "off"}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="right" 
                      onClick={() => updateSelectedText("align", "right")}
                      data-state={selectedObject.textAlign === "right" ? "on" : "off"}
                    >
                      <AlignRight className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>

                  <ToggleGroup type="multiple" className="flex gap-1">
                    <ToggleGroupItem 
                      value="bold" 
                      onClick={() => updateSelectedText("bold", "")}
                      data-state={selectedObject.fontWeight === "bold" ? "on" : "off"}
                    >
                      <Bold className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="italic" 
                      onClick={() => updateSelectedText("italic", "")}
                      data-state={selectedObject.fontStyle === "italic" ? "on" : "off"}
                    >
                      <Italic className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="underline" 
                      onClick={() => updateSelectedText("underline", "")}
                      data-state={selectedObject.underline ? "on" : "off"}
                    >
                      <Underline className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            <div className="flex flex-col gap-2">
              {TEXT_STYLES.map((style) => (
                <Button
                  key={style.value}
                  variant="outline"
                  className="justify-start"
                  onClick={() => addNewText(style.value)}
                >
                  <span className="mr-2">
                    {style.value === "h1" && <Heading1 className="h-4 w-4" />}
                    {style.value === "h2" && <Heading2 className="h-4 w-4" />}
                    {style.value === "normal" && <Type className="h-4 w-4" />}
                  </span>
                  {style.name}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {!selectedObject && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-400 text-lg">Click 'Add Text' to start editing</p>
        </div>
      )}
    </div>
  );
};