import { useState } from "react";
import { 
  BookOpen, 
  Users, 
  LineChart, 
  GitBranch, 
  Lightbulb,
  Wand2
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { StoriesDialog } from "@/components/StoriesDialog";
import { CharactersView } from "@/components/CharactersView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { StoryFlow } from "@/components/story-flow/StoryFlow";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { StoryProvider, useStory } from "@/contexts/StoryContext";