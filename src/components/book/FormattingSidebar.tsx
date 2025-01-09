import { useState, useEffect } from "react";
import { FileText, BookOpen, Award, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Document } from "@/types/story";

interface FormattingSidebarProps {
  document: Document | null;
  onSectionSelect: (section: string, content?: string) => void;
  currentContent?: string;
}

interface Chapter {
  number: number;
  title: string;
  content: string;
  startIndex: number;
}

export const FormattingSidebar = ({ document, onSectionSelect, currentContent }: FormattingSidebarProps) => {
  const [selectedSection, setSelectedSection] = useState<string>("content");
  const [detectedChapters, setDetectedChapters] = useState<Chapter[]>([]);

  const handleSectionClick = (section: string, content?: string) => {
    setSelectedSection(section);
    onSectionSelect(section, content);
  };

  useEffect(() => {
    if (currentContent) {
      const chapters = detectChapters(currentContent);
      setDetectedChapters(chapters);
    }
  }, [currentContent]);

  const detectChapters = (content: string): Chapter[] => {
    // This regex matches common chapter headings like "Chapter 1", "CHAPTER ONE", etc.
    const chapterRegex = /(?:Chapter|CHAPTER)\s+(?:\d+|[A-Za-z]+)[:\s-]*(.*?)(?=(?:Chapter|CHAPTER|\n\n|$))/gs;
    const chapters: Chapter[] = [];
    let match;
    let index = 1;

    while ((match = chapterRegex.exec(content)) !== null) {
      const startIndex = match.index;
      const chapterContent = match[0];
      const title = match[1]?.trim() || `Chapter ${index}`;
      
      chapters.push({
        number: index,
        title,
        content: chapterContent,
        startIndex
      });
      
      index++;
    }

    // If no chapters were detected, create artificial chapters based on paragraphs
    if (chapters.length === 0) {
      const paragraphs = content.split('\n\n');
      const chapterSize = Math.ceil(paragraphs.length / 10); // Split into ~10 chapters
      
      for (let i = 0; i < paragraphs.length; i += chapterSize) {
        const chapterContent = paragraphs.slice(i, i + chapterSize).join('\n\n');
        chapters.push({
          number: Math.floor(i / chapterSize) + 1,
          title: `Chapter ${Math.floor(i / chapterSize) + 1}`,
          content: chapterContent,
          startIndex: content.indexOf(chapterContent)
        });
      }
    }

    return chapters;
  };

  const frontMatterSections = [
    { id: "title", label: "Title Page", icon: FileText },
    { id: "copyright", label: "Copyright", icon: BookOpen },
    { id: "dedication", label: "Dedication", icon: Award },
    { id: "contents", label: "Contents", icon: List },
  ];

  return (
    <div className="w-48 border-r bg-white/50 backdrop-blur-sm flex flex-col h-full">
      <div className="p-2 border-b">
        <h3 className="text-sm font-medium text-gray-700">Document Sections</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {frontMatterSections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant={selectedSection === section.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 h-8"
                onClick={() => handleSectionClick(section.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{section.label}</span>
              </Button>
            );
          })}
          
          {currentContent && detectedChapters.length > 0 && (
            <div className="pt-4 space-y-1">
              <h4 className="text-xs font-medium text-gray-500 px-2">Chapters</h4>
              {detectedChapters.map((chapter) => (
                <Button
                  key={chapter.number}
                  variant={selectedSection === `chapter-${chapter.number}` ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2 h-8"
                  onClick={() => handleSectionClick(`chapter-${chapter.number}`, chapter.content)}
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-sm truncate">
                    Chapter {chapter.number}
                    {chapter.title !== `Chapter ${chapter.number}` && `: ${chapter.title}`}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};