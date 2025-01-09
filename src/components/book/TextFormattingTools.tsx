import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TextFormattingToolsProps {
  isAIMode: boolean;
  currentSection: string;
}

export const TextFormattingTools = ({ isAIMode, currentSection }: TextFormattingToolsProps) => {
  return (
    <div className="flex-1 flex">
      <div className="w-[21cm] mx-auto bg-white shadow-lg my-4 rounded-lg overflow-hidden border">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">
            {currentSection === 'title' && 'Title Page'}
            {currentSection === 'copyright' && 'Copyright Page'}
            {currentSection === 'dedication' && 'Dedication'}
            {currentSection === 'contents' && 'Table of Contents'}
            {currentSection.startsWith('chapter-') && `Chapter ${currentSection.split('-')[1]}`}
          </h2>
          <div className="prose max-w-none">
            {/* Content specific to each section would go here */}
            <p>Edit your {currentSection} content here...</p>
          </div>
        </div>
      </div>
      <div className="w-96 border-l">
        {/* Preview area */}
        <div className="p-4">
          <h3 className="text-sm font-medium mb-2">Preview</h3>
          <div className="aspect-[3/4] bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};
