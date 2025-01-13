import { 
  ArrowRight,
  Replace,
  ChevronDown,
  ChevronUp,
  Cloud,
  Plus,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

interface DocumentInsightsProps {
  content: string;
  onReplaceWord?: (oldWord: string, newWord: string, index: number) => void;
  onJumpToLocation?: (index: number) => void;
}

interface WordFrequency {
  [key: string]: number;
}

interface TrackedWord {
  word: string;
  goal: number;
}

export function DocumentInsights({ content, onReplaceWord, onJumpToLocation }: DocumentInsightsProps) {
  const [expandedSections, setExpandedSections] = useState({
    synonyms: true,
    usage: true,
    wordTracking: true
  });
  const [showWordCloud, setShowWordCloud] = useState(false);
  const [wordFrequency, setWordFrequency] = useState<WordFrequency>({});
  const [newTrackedWord, setNewTrackedWord] = useState('');
  const [newWordGoal, setNewWordGoal] = useState('');
  const [trackedWords, setTrackedWords] = useState<TrackedWord[]>([]);

  useEffect(() => {
    if (!content || !trackedWords.length) return;

    // Remove HTML tags and extract text content
    const textContent = content.replace(/<[^>]+>/g, '');
    const words = textContent.toLowerCase().split(/\s+/);
    
    // Count frequency for tracked words
    const frequency: WordFrequency = {};
    trackedWords.forEach(({ word }) => {
      frequency[word.toLowerCase()] = words.filter(w => w === word.toLowerCase()).length;
    });

    setWordFrequency(frequency);
  }, [content, trackedWords]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addTrackedWord = () => {
    if (!newTrackedWord || !newWordGoal) return;
    
    setTrackedWords(prev => [...prev, {
      word: newTrackedWord.toLowerCase(),
      goal: parseInt(newWordGoal)
    }]);
    
    setNewTrackedWord('');
    setNewWordGoal('');
  };

  const removeTrackedWord = (wordToRemove: string) => {
    setTrackedWords(prev => prev.filter(({ word }) => word !== wordToRemove));
  };

  const getWordCount = (word: string): number => {
    return wordFrequency[word.toLowerCase()] || 0;
  };

  const mockSynonyms = {
    "just": ["simply", "merely", "only", "precisely"],
    "very": ["extremely", "highly", "particularly", "notably"],
    "really": ["genuinely", "truly", "absolutely", "certainly"],
    "actually": ["in fact", "indeed", "as a matter of fact", "in reality"]
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
            {/* Word Tracking Section */}
            <Collapsible 
              open={expandedSections.wordTracking}
              className="space-y-2"
            >
              <CollapsibleTrigger
                onClick={() => toggleSection('wordTracking')}
                className="flex items-center justify-between w-full"
              >
                <h4 className="text-sm font-medium">Word Tracking</h4>
                {expandedSections.wordTracking ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Word to track"
                    value={newTrackedWord}
                    onChange={(e) => setNewTrackedWord(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Goal"
                    value={newWordGoal}
                    onChange={(e) => setNewWordGoal(e.target.value)}
                    className="w-24"
                  />
                  <Button
                    size="sm"
                    onClick={addTrackedWord}
                    disabled={!newTrackedWord || !newWordGoal}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {trackedWords.map(({ word, goal }) => {
                    const count = getWordCount(word);
                    const progress = Math.min((count / goal) * 100, 100);
                    
                    return (
                      <div key={word} className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">"{word}"</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTrackedWord(word)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{count} / {goal} occurrences</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>

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