import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { BookSize, PLATFORMS } from "@/lib/formatting-constants";

interface BookSizeSelectorProps {
  onSizeChange: (size: BookSize) => void;
  selectedFormat?: string;
}

export const BookSizeSelector = ({ onSizeChange, selectedFormat }: BookSizeSelectorProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>(PLATFORMS[0].name);
  const [customSize, setCustomSize] = useState<BookSize>({ width: 6, height: 9, name: "Custom", category: "Custom" });
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    // Reset size when platform changes
    if (selectedPlatform) {
      const platform = PLATFORMS.find(p => p.name === selectedPlatform);
      if (platform?.trimSizes.length > 0) {
        handleSizeChange(platform.trimSizes[0].name);
      }
    }
  }, [selectedPlatform]);

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value);
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    if (value === "custom") {
      onSizeChange(customSize);
    } else {
      const platform = PLATFORMS.find(p => p.name === selectedPlatform);
      const size = platform?.trimSizes.find(s => s.name === value);
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

  const currentPlatform = PLATFORMS.find(p => p.name === selectedPlatform);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Publishing Platform</Label>
        <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a platform" />
          </SelectTrigger>
          <SelectContent>
            {PLATFORMS.map((platform) => (
              <SelectItem key={platform.name} value={platform.name}>
                {platform.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentPlatform && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="text-sm">
              <p className="font-medium mb-1">{currentPlatform.description}</p>
              <ul className="list-disc list-inside space-y-1">
                {currentPlatform.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label>Trim Size</Label>
        <Select value={selectedSize} onValueChange={handleSizeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            {currentPlatform?.trimSizes.map((size) => (
              <SelectItem key={size.name} value={size.name}>
                {size.name} ({size.category})
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