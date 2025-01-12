import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  Replace,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DocumentInsightsProps {
  content: string;
  onReplaceWord?: (oldWord: string, newWord: string, index: number) => void;
  onJumpToLocation?: (index: number) => void;
}

export function DocumentInsights({ content, onReplaceWord, onJumpToLocation }: DocumentInsightsProps) {
  const [expandedSections, setExpandedSections] = useState({
    synonyms: true,
    usage: true,
    goals: true
  });

  // Mock data for demonstration - in a real app, this would come from an API or analysis
  const wordFrequency = {
    "just": 16,
    "very": 12,
    "really": 8,
    "actually": 6
  };

  const mockSynonyms = {
    "just": ["simply", "merely", "only", "precisely"],
    "very": ["extremely", "highly", "particularly", "notably"],
    "really": ["genuinely", "truly", "absolutely", "certainly"],
    "actually": ["in fact", "indeed", "as a matter of fact", "in reality"]
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Document Insights</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Synonym Suggestions */}
          <Collapsible 
            open={expandedSections.synonyms}
            className="space-y-2"
          >
            <CollapsibleTrigger
              onClick={() => toggleSection('synonyms')}
              className="flex items-center justify-between w-full"
            >
              <h4 className="text-sm font-medium">Synonym Suggestions</h4>
              {expandedSections.synonyms ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3">
              {Object.entries(mockSynonyms).map(([word, synonyms]) => (
                <div key={word} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-sm mb-2">"{word}"</div>
                  <div className="space-y-2">
                    {synonyms.map((synonym, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{synonym}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => onReplaceWord?.(word, synonym, 0)}
                        >
                          <Replace className="h-3 w-3 mr-1" />
                          Replace
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Word Goals & Frequency */}
          <Collapsible 
            open={expandedSections.goals}
            className="space-y-2"
          >
            <CollapsibleTrigger
              onClick={() => toggleSection('goals')}
              className="flex items-center justify-between w-full"
            >
              <h4 className="text-sm font-medium">Word Goals & Frequency</h4>
              {expandedSections.goals ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              {Object.entries(wordFrequency).map(([word, count]) => (
                <div key={word} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Reduce "{word}"</span>
                    <span className="text-gray-500">{count} occurrences</span>
                  </div>
                  <Progress value={((16 - count) / 16) * 100} className="h-2" />
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Contextual Usage */}
          <Collapsible 
            open={expandedSections.usage}
            className="space-y-2"
          >
            <CollapsibleTrigger
              onClick={() => toggleSection('usage')}
              className="flex items-center justify-between w-full"
            >
              <h4 className="text-sm font-medium">Contextual Usage</h4>
              {expandedSections.usage ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3">
              {Object.keys(wordFrequency).map((word, idx) => (
                <div key={word} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">"{word}"</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => onJumpToLocation?.(idx)}
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Jump to
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    ...the context where this word appears would be shown here...
                  </p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
}