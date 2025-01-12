import { 
  ArrowRight,
  Replace,
  ChevronDown,
  ChevronUp,
  Cloud,
  ArrowLeft
} from "lucide-react";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DocumentInsightsProps {
  content: string;
  onReplaceWord?: (oldWord: string, newWord: string, index: number) => void;
  onJumpToLocation?: (index: number) => void;
}

interface WordFrequency {
  [key: string]: number;
}

export function DocumentInsights({ content, onReplaceWord, onJumpToLocation }: DocumentInsightsProps) {
  const [expandedSections, setExpandedSections] = useState({
    synonyms: true,
    usage: true,
    goals: true
  });
  const [showWordCloud, setShowWordCloud] = useState(false);
  const [wordFrequency, setWordFrequency] = useState<WordFrequency>({});

  useEffect(() => {
    if (!content) return;

    // Remove HTML tags and extract text content
    const textContent = content.replace(/<[^>]+>/g, '');

    // Split into words and count frequencies
    const words = textContent.toLowerCase()
      .split(/\s+/)
      .filter(word => 
        // Filter out common words and short words
        word.length > 3 && 
        !['the', 'and', 'that', 'this', 'with', 'from', 'they', 'have', 'were'].includes(word)
      );

    const frequency: WordFrequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Sort by frequency and take top words
    const sortedWords = Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .reduce((obj, [word, count]) => ({
        ...obj,
        [word]: count
      }), {});

    setWordFrequency(sortedWords);
  }, [content]);

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Document Insights</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWordCloud(!showWordCloud)}
            className="gap-2"
          >
            <Cloud className="h-4 w-4" />
            Word Cloud
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {showWordCloud ? (
          <div className="p-4 flex items-center justify-center min-h-[400px]">
            <img 
              src="/lovable-uploads/f50826f3-d6b0-4fdc-8359-6cd97cffafc9.png" 
              alt="Word Cloud"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
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
                      <span>"{word}"</span>
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
                {Object.entries(wordFrequency).slice(0, 5).map(([word, count], idx) => (
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
        )}
      </div>
    </div>
  );
}