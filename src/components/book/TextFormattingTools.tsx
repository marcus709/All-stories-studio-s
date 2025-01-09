import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TextFormattingToolsProps {
  isAIMode: boolean;
  currentSection: string;
  sectionContent?: string;
}

export const TextFormattingTools = ({ 
  isAIMode, 
  currentSection = 'content',
  sectionContent
}: TextFormattingToolsProps) => {
  const getSectionTitle = (section: string) => {
    if (!section) return 'Content';
    
    if (section === 'title') return 'Title Page';
    if (section === 'copyright') return 'Copyright Page';
    if (section === 'dedication') return 'Dedication';
    if (section === 'contents') return 'Table of Contents';
    if (section.startsWith('chapter-')) return `Chapter ${section.split('-')[1]}`;
    
    return 'Content';
  };

  return (
    <div className="flex-1 flex">
      <div className="w-[21cm] mx-auto bg-white shadow-lg my-4 rounded-lg overflow-hidden border">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">
            {getSectionTitle(currentSection)}
          </h2>
          <div className="prose max-w-none">
            {sectionContent ? (
              <div dangerouslySetInnerHTML={{ __html: sectionContent.split('\n').join('<br />') }} />
            ) : (
              <p>Edit your {currentSection} content here...</p>
            )}
          </div>
        </div>
      </div>
      <div className="w-96 border-l">
        <div className="p-4">
          <h3 className="text-sm font-medium mb-2">Preview</h3>
          <div className="aspect-[3/4] bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};