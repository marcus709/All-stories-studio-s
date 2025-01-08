import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export interface BookSize {
  width: number;
  height: number;
  name: string;
}

const STANDARD_SIZES: BookSize[] = [
  { width: 6, height: 9, name: "Trade Paperback (6\" × 9\")" },
  { width: 5, height: 8, name: "Digest (5\" × 8\")" },
  { width: 8.27, height: 11.69, name: "A4" },
  { width: 7, height: 10, name: "Textbook (7\" × 10\")" },
];

interface BookSizeSelectorProps {
  onSizeChange: (size: BookSize) => void;
}

export const BookSizeSelector = ({ onSizeChange }: BookSizeSelectorProps) => {
  const [customSize, setCustomSize] = useState<BookSize>({ width: 6, height: 9, name: "Custom" });
  const [selectedSize, setSelectedSize] = useState<string>(STANDARD_SIZES[0].name);

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    if (value === "custom") {
      onSizeChange(customSize);
    } else {
      const size = STANDARD_SIZES.find(s => s.name === value);
      if (size) onSizeChange(size);
    }
  };

  const handleCustomSizeChange = (dimension: "width" | "height", value: string) => {
    const numValue = parseFloat(value) || 0;
    const newCustomSize = {
      ...customSize,
      [dimension]: numValue,
    };
    setCustomSize(newCustomSize);
    if (selectedSize === "custom") {
      onSizeChange(newCustomSize);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Book Size</Label>
        <Select value={selectedSize} onValueChange={handleSizeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            {STANDARD_SIZES.map((size) => (
              <SelectItem key={size.name} value={size.name}>
                {size.name}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom Size</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedSize === "custom" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Width (inches)</Label>
            <Input
              type="number"
              step="0.1"
              value={customSize.width}
              onChange={(e) => handleCustomSizeChange("width", e.target.value)}
              min={1}
              max={20}
            />
          </div>
          <div className="space-y-2">
            <Label>Height (inches)</Label>
            <Input
              type="number"
              step="0.1"
              value={customSize.height}
              onChange={(e) => handleCustomSizeChange("height", e.target.value)}
              min={1}
              max={20}
            />
          </div>
        </div>
      )}
    </div>
  );
};