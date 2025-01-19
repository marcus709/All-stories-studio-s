import { useStory } from "@/contexts/StoryContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Globe,
  Users,
  ScrollText,
  Building,
  Heart,
  BookOpen,
  Languages,
  Sparkles,
} from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { useState } from "react";

export const StoryIdeasView = () => {
  const { selectedStory } = useStory();
  const { generateContent, isLoading } = useAI();
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [selectedSection, setSelectedSection] = useState("society");

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Please select a story to continue</p>
      </div>
    );
  }

  const handleGenerateSuggestions = async (section: string, prompt: string) => {
    const suggestions = await generateContent(
      `Generate suggestions for ${section}: ${prompt}`,
      'suggestions'
    );
    if (suggestions) {
      setAiSuggestions(suggestions);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Dynamic Overview Pane (Left) */}
      <div className="w-64 border-r border-border/40 p-4 bg-background/60 backdrop-blur-xl">
        <ScrollArea className="h-full">
          <Accordion
            type="single"
            collapsible
            defaultValue="culture"
            className="space-y-2"
          >
            <AccordionItem value="culture">
              <AccordionTrigger className="text-sm font-medium">
                Culture
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("society")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Society & Government
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("beliefs")}
                  >
                    <ScrollText className="h-4 w-4 mr-2" />
                    Beliefs & Religion
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("customs")}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Customs & Taboos
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("economy")}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Economy & Daily Life
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("social")}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Social Structure
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="language">
              <AccordionTrigger className="text-sm font-medium">
                Language
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("phonetics")}
                  >
                    <Languages className="h-4 w-4 mr-2" />
                    Phonetics & Phonology
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("grammar")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Grammar & Morphology
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("lexicon")}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Lexicon & Words
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>

      {/* Main Editor Pane (Center) */}
      <div className="flex-1 p-6 overflow-auto">
        <Tabs defaultValue="culture" className="h-full">
          <TabsList>
            <TabsTrigger value="culture">Culture</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
          </TabsList>

          <TabsContent value="culture" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Government Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select government type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monarchy">Monarchy</SelectItem>
                    <SelectItem value="democracy">Democracy</SelectItem>
                    <SelectItem value="theocracy">Theocracy</SelectItem>
                    <SelectItem value="clan">Clan-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Beliefs & Religion</Label>
                <Textarea 
                  placeholder="Describe the religious beliefs and practices..."
                  className="h-24"
                />
              </div>

              <div>
                <Label>Customs & Traditions</Label>
                <Textarea 
                  placeholder="Describe important customs and traditions..."
                  className="h-24"
                />
              </div>

              <Button 
                onClick={() => handleGenerateSuggestions("culture", "Generate cultural elements based on the provided information")}
                disabled={isLoading}
              >
                Generate Suggestions
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Language Name</Label>
                <Input placeholder="Enter the name of the language" />
              </div>

              <div>
                <Label>Phonetic System</Label>
                <Textarea 
                  placeholder="Describe the sounds and phonetic rules..."
                  className="h-24"
                />
              </div>

              <div>
                <Label>Grammar Structure</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select basic word order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="svo">Subject-Verb-Object (SVO)</SelectItem>
                    <SelectItem value="sov">Subject-Object-Verb (SOV)</SelectItem>
                    <SelectItem value="vso">Verb-Subject-Object (VSO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => handleGenerateSuggestions("language", "Generate language elements based on the provided structure")}
                disabled={isLoading}
              >
                Generate Suggestions
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Suggestions Pane (Right) */}
      <div className="w-80 border-l border-border/40 p-4 bg-background/60 backdrop-blur-xl">
        <div className="space-y-4">
          <h3 className="font-semibold">AI Suggestions</h3>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="prose prose-sm">
              {aiSuggestions ? (
                <div dangerouslySetInnerHTML={{ __html: aiSuggestions }} />
              ) : (
                <p className="text-muted-foreground">
                  Click "Generate Suggestions" to get AI-powered recommendations for your world building.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};