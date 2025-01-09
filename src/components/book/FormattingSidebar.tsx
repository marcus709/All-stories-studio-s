import { useState } from "react";
import { FileText, BookOpen, Award, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Document } from "@/types/story";

interface FormattingSidebarProps {
  document: Document | null;
  onSectionSelect: (section: string) => void;
}

export const FormattingSidebar = ({ document, onSectionSelect }: FormattingSidebarProps) => {
  const [selectedSection, setSelectedSection] = useState<string>("content");

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    onSectionSelect(section);
  };

  const frontMatterSections = [
    { id: "title", label: "Title Page", icon: FileText },
    { id: "copyright", label: "Copyright", icon: BookOpen },
    { id: "dedication", label: "Dedication", icon: Award },
    { id: "contents", label: "Contents", icon: List },
  ];

  // Mock chapters for demonstration - in a real app, these would be parsed from the document
  const chapters = [
    "There Is No One Left",
    "Mistress Mary Quite Contrary",
    "Across The Moor",
    "Martha",
    "The Cry In The Corridor",
    "There Was Someone Crying",
    "The Key Of The Garden",
    "The Robin Who Showed The Way",
  ];

  return (
    <div className="w-64 border-r bg-white/50 backdrop-blur-sm flex flex-col h-full">
      <div className="p-3 border-b">
        <h3 className="text-sm font-medium text-gray-900">Document Sections</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {frontMatterSections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant={selectedSection === section.id ? "secondary" : "ghost"}
                className={`w-full justify-start gap-2 h-9 mb-1 ${
                  selectedSection === section.id 
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleSectionClick(section.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </Button>
            );
          })}
          
          {document?.content && (
            <div className="mt-6">
              <h4 className="text-xs font-medium text-gray-500 px-2 mb-2">Chapters</h4>
              {chapters.map((chapter, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`w-full justify-start h-9 mb-1 text-left ${
                    selectedSection === `chapter-${index + 1}` 
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800" 
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSectionClick(`chapter-${index + 1}`)}
                >
                  <span className="text-sm font-medium mr-2">{index + 1}.</span>
                  <span className="text-sm truncate">{chapter}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};