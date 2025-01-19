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
  Crown,
  Scroll,
  Coins,
  Home,
} from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { useState } from "react";

export const StoryIdeasView = () => {
  const { selectedStory } = useStory();
  const { generateContent, isLoading } = useAI();
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [selectedSection, setSelectedSection] = useState("society");

  // Form state
  const [governmentType, setGovernmentType] = useState("");
  const [beliefs, setBeliefs] = useState("");
  const [customs, setCustoms] = useState("");
  const [economy, setEconomy] = useState("");
  const [socialStructure, setSocialStructure] = useState("");
  const [deities, setDeities] = useState("");
  const [festivals, setFestivals] = useState("");
  const [resources, setResources] = useState("");
  const [familyStructure, setFamilyStructure] = useState("");
  const [languageName, setLanguageName] = useState("");
  const [phonetics, setPhonetics] = useState("");
  const [grammar, setGrammar] = useState("");

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Please select a story to continue</p>
      </div>
    );
  }

  const handleGenerateSuggestions = async (section: string) => {
    let prompt = "";
    switch (section) {
      case "government":
        prompt = `Given a ${governmentType} government type, suggest some typical laws, social hierarchies, and potential conflicts.`;
        break;
      case "beliefs":
        prompt = `Based on these deities (${deities}) and festivals (${festivals}), suggest some religious customs and spiritual implications.`;
        break;
      case "customs":
        prompt = `For a culture with these customs (${customs}), suggest related traditions and social norms.`;
        break;
      case "economy":
        prompt = `Given these resources (${resources}) and economic structure, suggest trade relationships and social implications.`;
        break;
      case "social":
        prompt = `For a society with this family structure (${familyStructure}) and social organization, suggest potential story conflicts and cultural dynamics.`;
        break;
      case "language":
        prompt = `Based on the language name "${languageName}" and phonetic system (${phonetics}), suggest some sample words and phrases.`;
        break;
      default:
        prompt = "Generate general cultural suggestions";
    }

    const suggestions = await generateContent(prompt, 'suggestions');
    if (suggestions) {
      setAiSuggestions(suggestions);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Dynamic Overview Pane (Left) */}
      <div className="w-64 border-r border-border/40 p-4 bg-background/60 backdrop-blur-xl">
        <ScrollArea className="h-full">
          <Accordion type="single" collapsible defaultValue="culture" className="space-y-2">
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
                    <Crown className="h-4 w-4 mr-2" />
                    Government
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("beliefs")}
                  >
                    <Scroll className="h-4 w-4 mr-2" />
                    Religion & Beliefs
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("customs")}
                  >
                    <ScrollText className="h-4 w-4 mr-2" />
                    Customs & Traditions
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("economy")}
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Economy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("social")}
                  >
                    <Home className="h-4 w-4 mr-2" />
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
                    Phonetics
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedSection("grammar")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Grammar
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
                <Select value={governmentType} onValueChange={setGovernmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select government type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monarchy">Monarchy</SelectItem>
                    <SelectItem value="democracy">Democracy</SelectItem>
                    <SelectItem value="theocracy">Theocracy</SelectItem>
                    <SelectItem value="clan">Clan-based</SelectItem>
                    <SelectItem value="oligarchy">Oligarchy</SelectItem>
                    <SelectItem value="tribal">Tribal Council</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Deities & Religious Figures</Label>
                <Textarea 
                  value={deities}
                  onChange={(e) => setDeities(e.target.value)}
                  placeholder="Describe the major deities, their domains, and relationships..."
                  className="h-24"
                />
              </div>

              <div>
                <Label>Festivals & Ceremonies</Label>
                <Textarea 
                  value={festivals}
                  onChange={(e) => setFestivals(e.target.value)}
                  placeholder="Describe important festivals, ceremonies, and their significance..."
                  className="h-24"
                />
              </div>

              <div>
                <Label>Customs & Traditions</Label>
                <Textarea 
                  value={customs}
                  onChange={(e) => setCustoms(e.target.value)}
                  placeholder="Describe daily customs, social norms, and taboos..."
                  className="h-24"
                />
              </div>

              <div>
                <Label>Resources & Economy</Label>
                <Textarea 
                  value={resources}
                  onChange={(e) => setResources(e.target.value)}
                  placeholder="Describe main resources, trade goods, and economic system..."
                  className="h-24"
                />
              </div>

              <div>
                <Label>Family & Social Structure</Label>
                <Textarea 
                  value={familyStructure}
                  onChange={(e) => setFamilyStructure(e.target.value)}
                  placeholder="Describe family units, social classes, and hierarchies..."
                  className="h-24"
                />
              </div>

              <Button 
                onClick={() => handleGenerateSuggestions(selectedSection)}
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
                <Input 
                  value={languageName}
                  onChange={(e) => setLanguageName(e.target.value)}
                  placeholder="Enter the name of the language" 
                />
              </div>

              <div>
                <Label>Phonetic System</Label>
                <Textarea 
                  value={phonetics}
                  onChange={(e) => setPhonetics(e.target.value)}
                  placeholder="Describe the sounds, phonetic rules, and pronunciation patterns..."
                  className="h-24"
                />
              </div>

              <div>
                <Label>Grammar Structure</Label>
                <Textarea 
                  value={grammar}
                  onChange={(e) => setGrammar(e.target.value)}
                  placeholder="Describe grammar rules, word order, and special linguistic features..."
                  className="h-24"
                />
              </div>

              <Button 
                onClick={() => handleGenerateSuggestions("language")}
                disabled={isLoading}
              >
                Generate Suggestions
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Suggestions Pane (Right) */}
      <div className="w-96 border-l border-border/40 p-4 bg-background/60 backdrop-blur-xl">
        <div className="space-y-4">
          <h3 className="font-semibold">AI Suggestions</h3>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="prose prose-sm">
              {aiSuggestions ? (
                <div dangerouslySetInnerHTML={{ __html: aiSuggestions }} />
              ) : (
                <p className="text-muted-foreground">
                  Fill in the details in the main editor and click "Generate Suggestions" to get AI-powered recommendations for your world building.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};