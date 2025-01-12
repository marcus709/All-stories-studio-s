import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight, Replace, ArrowRight, BookOpen, Target, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightsSidebarProps {
  document: {
    id: string;
    title: string;
    content: string;
  };
}

interface WordFrequency {
  word: string;
  count: number;
  goal?: number;
}

export const InsightsSidebar = ({ document }: InsightsSidebarProps) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['synonyms', 'goals', 'cloud', 'context']);

  // Mock data - In a real implementation, these would be calculated from the document
  const wordFrequencies: WordFrequency[] = [
    { word: "just", count: 16, goal: 8 },
    { word: "very", count: 12, goal: 6 },
    { word: "really", count: 10, goal: 5 },
  ];

  const mockSynonyms = {
    "just": ["simply", "merely", "only", "purely"],
    "very": ["extremely", "highly", "incredibly", "particularly"],
    "really": ["genuinely", "truly", "absolutely", "actually"],
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getWordContexts = (word: string) => {
    const regex = new RegExp(`(?:\\w+\\W+){0,10}${word}(?:\\W+\\w+){0,10}`, 'gi');
    const matches = document.content.match(regex) || [];
    return matches.map(context => ({
      context,
      index: document.content.indexOf(context)
    }));
  };

  return (
    <Sidebar className="w-80 border-l">
      <SidebarHeader className="border-b p-4">
        <h2 className="text-lg font-semibold">Document Insights</h2>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent>
          <div className="space-y-4 p-4">
            {/* Synonym Suggestions */}
            <Collapsible
              open={expandedSections.includes('synonyms')}
              className="space-y-2"
            >
              <CollapsibleTrigger
                onClick={() => toggleSection('synonyms')}
                className="flex items-center gap-2 w-full text-left font-medium"
              >
                {expandedSections.includes('synonyms') ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <BookOpen className="h-4 w-4" />
                Synonym Suggestions
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {selectedWord && mockSynonyms[selectedWord as keyof typeof mockSynonyms] && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Synonyms for "{selectedWord}":
                    </p>
                    <div className="space-y-1">
                      {mockSynonyms[selectedWord as keyof typeof mockSynonyms].map((synonym) => (
                        <div key={synonym} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                          <span className="text-sm">{synonym}</span>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Replace className="h-3 w-3 mr-1" />
                            Replace
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Word Goals & Progress */}
            <Collapsible
              open={expandedSections.includes('goals')}
              className="space-y-2"
            >
              <CollapsibleTrigger
                onClick={() => toggleSection('goals')}
                className="flex items-center gap-2 w-full text-left font-medium"
              >
                {expandedSections.includes('goals') ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <Target className="h-4 w-4" />
                Word Goals
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4">
                {wordFrequencies.map((word) => (
                  <div key={word.word} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reduce "{word.word}"</span>
                      <span className="text-muted-foreground">{word.count}/{word.goal} occurrences</span>
                    </div>
                    <Progress
                      value={((word.goal || 0) / word.count) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Word Cloud */}
            <Collapsible
              open={expandedSections.includes('cloud')}
              className="space-y-2"
            >
              <CollapsibleTrigger
                onClick={() => toggleSection('cloud')}
                className="flex items-center gap-2 w-full text-left font-medium"
              >
                {expandedSections.includes('cloud') ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <Cloud className="h-4 w-4" />
                Word Cloud
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {wordFrequencies.map((word) => (
                      <button
                        key={word.word}
                        onClick={() => setSelectedWord(word.word)}
                        className={cn(
                          "px-2 py-1 rounded-full text-sm transition-colors",
                          selectedWord === word.word
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        )}
                        style={{
                          fontSize: `${Math.max(0.8, word.count / 10)}rem`
                        }}
                      >
                        {word.word}
                      </button>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Contextual Usage */}
            <Collapsible
              open={expandedSections.includes('context')}
              className="space-y-2"
            >
              <CollapsibleTrigger
                onClick={() => toggleSection('context')}
                className="flex items-center gap-2 w-full text-left font-medium"
              >
                {expandedSections.includes('context') ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Contextual Usage
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {selectedWord && getWordContexts(selectedWord).map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div 
                      className="text-sm p-2 bg-muted rounded-lg"
                      dangerouslySetInnerHTML={{
                        __html: item.context.replace(
                          new RegExp(`(${selectedWord})`, 'gi'),
                          '<strong class="text-primary">$1</strong>'
                        )
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full h-6 text-xs"
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Jump to Location
                    </Button>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
};