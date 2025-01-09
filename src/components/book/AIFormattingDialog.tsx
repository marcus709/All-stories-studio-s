import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings } from "lucide-react";

interface FormatConfig {
  format: string;
  size: string;
  customWidth?: string;
  customHeight?: string;
  bleed: string;
  gutterMargin: string;
}

interface AIFormattingDialogProps {
  onConfigSubmit: (config: FormatConfig) => void;
}

interface FormatInfo {
  sizes: string[];
  digitalFormats: string[];
}

const PRINT_FORMATS: Record<string, FormatInfo> = {
  "Trade Paperback": {
    sizes: ["5 x 8", "5.5 x 8.5", "6 x 9"],
    digitalFormats: ["EPUB", "MOBI", "PDF"]
  },
  "Mass Market": {
    sizes: ["4.25 x 6.87"],
    digitalFormats: ["EPUB", "MOBI"]
  },
  "Hardcover": {
    sizes: ["6 x 9", "6.14 x 9.21", "7 x 10"],
    digitalFormats: ["EPUB", "MOBI"]
  },
  "Non-Fiction": {
    sizes: ["7 x 10", "8.5 x 11"],
    digitalFormats: ["PDF"]
  },
  "Photo Books": {
    sizes: ["8 x 10", "8.5 x 8.5", "11 x 8.5"],
    digitalFormats: ["PDF (Fixed Layout)"]
  },
  "Children's Books": {
    sizes: ["8 x 8", "8.5 x 8.5", "11 x 8.5"],
    digitalFormats: ["EPUB"]
  },
  "Global (ISO)": {
    sizes: ["5.83 x 8.27 (A5)", "8.27 x 11.69 (A4)", "6.93 x 9.84 (B5)"],
    digitalFormats: ["EPUB", "PDF"]
  },
  "Custom": {
    sizes: ["custom"],
    digitalFormats: ["EPUB", "PDF", "MOBI"]
  }
};

export function AIFormattingDialog({ onConfigSubmit }: AIFormattingDialogProps) {
  const [format, setFormat] = useState<string>(Object.keys(PRINT_FORMATS)[0]);
  const [size, setSize] = useState<string>(PRINT_FORMATS[Object.keys(PRINT_FORMATS)[0]].sizes[0]);
  const [customWidth, setCustomWidth] = useState<string>("");
  const [customHeight, setCustomHeight] = useState<string>("");
  const [bleed, setBleed] = useState<string>("0.125");
  const [gutterMargin, setGutterMargin] = useState<string>("0.5");

  const handleSubmit = () => {
    onConfigSubmit({
      format,
      size,
      customWidth: format === "Custom" ? customWidth : undefined,
      customHeight: format === "Custom" ? customHeight : undefined,
      bleed,
      gutterMargin
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Format Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Format Configuration</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Book Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(PRINT_FORMATS).map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Available digital formats: {PRINT_FORMATS[format].digitalFormats.join(", ")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {PRINT_FORMATS[format].sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {format === "Custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Width (inches)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    placeholder="e.g., 6.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height (inches)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    placeholder="e.g., 9.0"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Bleed (inches)</Label>
              <Input
                type="number"
                step="0.001"
                value={bleed}
                onChange={(e) => setBleed(e.target.value)}
                placeholder="e.g., 0.125"
              />
            </div>

            <div className="space-y-2">
              <Label>Gutter Margin (inches)</Label>
              <Input
                type="number"
                step="0.1"
                value={gutterMargin}
                onChange={(e) => setGutterMargin(e.target.value)}
                placeholder="e.g., 0.5"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Apply Format
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}