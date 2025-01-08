import { Palette } from "lucide-react";
import { Template } from "@/types/book";

interface PropertiesPanelProps {
  selectedTemplate: Template | null;
}

export const PropertiesPanel = ({ selectedTemplate }: PropertiesPanelProps) => {
  return (
    <div className="w-80 border-l bg-white p-6">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="h-5 w-5" />
        <h2 className="font-semibold">Properties</h2>
      </div>
      {selectedTemplate ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Template</p>
            <p className="text-sm text-gray-500">{selectedTemplate.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Genre</p>
            <p className="text-sm text-gray-500">{selectedTemplate.genre}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Colors</p>
            <div className="flex gap-2">
              {selectedTemplate.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center">
          Select an element to edit its properties
        </p>
      )}
    </div>
  );
};