import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ResponseStyleSelect } from "./config/ResponseStyleSelect";
import { FocusAreaSelect } from "./config/FocusAreaSelect";
import { ToneAndVoiceConfig } from "./config/ToneAndVoiceConfig";
import { GenreSelect } from "./config/GenreSelect";
import { RulesConfig } from "./config/RulesConfig";
import { KeywordsConfig } from "./config/KeywordsConfig";
import { AdvancedConfig } from "./config/AdvancedConfig";

interface AIConfiguration {
  name: string;
  response_style: string;
  focus_area: string;
  tone: string;
  point_of_view: string;
  genre: string;
  character_rules: string[];
  plot_rules: string[];
  custom_prompt: string;
  keywords_include: string[];
  keywords_avoid: string[];
  creativity_level: number;
  suggestion_complexity: string;
  feedback_cycle: string;
  feedback_format: string;
}

interface AIConfigurationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  configToEdit?: {
    id: string;
    name: string;
    response_style: string;
    focus_area: string;
    tone: string;
    point_of_view: string;
    genre: string;
    character_rules: string[];
    plot_rules: string[];
    custom_prompt: string;
    keywords_include: string[];
    keywords_avoid: string[];
    creativity_level: number;
    suggestion_complexity: string;
    feedback_cycle: string;
    feedback_format: string;
  };
  onConfigSaved: () => void;
}

export function AIConfigurationDialog({
  isOpen,
  onClose,
  configToEdit,
  onConfigSaved,
}: AIConfigurationDialogProps) {
  const session = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [config, setConfig] = React.useState<AIConfiguration>({
    name: "",
    response_style: "descriptive",
    focus_area: "character_development",
    tone: "neutral",
    point_of_view: "neutral",
    genre: "fantasy",
    character_rules: [],
    plot_rules: [],
    custom_prompt: "",
    keywords_include: [],
    keywords_avoid: [],
    creativity_level: 5,
    suggestion_complexity: "medium",
    feedback_cycle: "suggest_and_wait",
    feedback_format: "bulleted_list",
  });

  React.useEffect(() => {
    if (configToEdit) {
      setConfig(configToEdit);
    } else {
      setConfig({
        name: "",
        response_style: "descriptive",
        focus_area: "character_development",
        tone: "neutral",
        point_of_view: "neutral",
        genre: "fantasy",
        character_rules: [],
        plot_rules: [],
        custom_prompt: "",
        keywords_include: [],
        keywords_avoid: [],
        creativity_level: 5,
        suggestion_complexity: "medium",
        feedback_cycle: "suggest_and_wait",
        feedback_format: "bulleted_list",
      });
    }
  }, [configToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      if (configToEdit) {
        await supabase
          .from("ai_configurations")
          .update(config)
          .eq("id", configToEdit.id);
      } else {
        await supabase.from("ai_configurations").insert({
          ...config,
          user_id: session.user.id,
        });
      }

      toast({
        title: "Success",
        description: `AI configuration ${configToEdit ? "updated" : "created"} successfully.`,
      });
      onConfigSaved();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save AI configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{configToEdit ? "Edit" : "Create"} AI Configuration</DialogTitle>
          <DialogDescription>
            Configure how the AI assistant will help with your writing.
          </DialogDescription>
          <Button
            type="button"
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Configuration Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="My AI Configuration"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <ResponseStyleSelect
                value={config.response_style}
                onChange={(value) => setConfig((prev) => ({ ...prev, response_style: value }))}
              />

              <FocusAreaSelect
                value={config.focus_area}
                onChange={(value) => setConfig((prev) => ({ ...prev, focus_area: value }))}
              />

              <ToneAndVoiceConfig
                tone={config.tone}
                pointOfView={config.point_of_view}
                onToneChange={(value) => setConfig((prev) => ({ ...prev, tone: value }))}
                onPovChange={(value) => setConfig((prev) => ({ ...prev, point_of_view: value }))}
              />

              <GenreSelect
                value={config.genre}
                onChange={(value) => setConfig((prev) => ({ ...prev, genre: value }))}
              />
            </div>

            <div className="space-y-6">
              <RulesConfig
                characterRules={config.character_rules}
                plotRules={config.plot_rules}
                onCharacterRulesChange={(rules) => setConfig((prev) => ({ ...prev, character_rules: rules }))}
                onPlotRulesChange={(rules) => setConfig((prev) => ({ ...prev, plot_rules: rules }))}
              />

              <KeywordsConfig
                includeKeywords={config.keywords_include}
                avoidKeywords={config.keywords_avoid}
                onIncludeKeywordsChange={(keywords) => setConfig((prev) => ({ ...prev, keywords_include: keywords }))}
                onAvoidKeywordsChange={(keywords) => setConfig((prev) => ({ ...prev, keywords_avoid: keywords }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Custom Prompt</Label>
            <Textarea
              value={config.custom_prompt}
              onChange={(e) => setConfig((prev) => ({ ...prev, custom_prompt: e.target.value }))}
              placeholder="Enter any specific instructions for the AI..."
              className="min-h-[100px]"
            />
          </div>

          <AdvancedConfig
            creativityLevel={config.creativity_level}
            suggestionComplexity={config.suggestion_complexity}
            feedbackCycle={config.feedback_cycle}
            feedbackFormat={config.feedback_format}
            onCreativityLevelChange={(value) => setConfig((prev) => ({ ...prev, creativity_level: value }))}
            onSuggestionComplexityChange={(value) => setConfig((prev) => ({ ...prev, suggestion_complexity: value }))}
            onFeedbackCycleChange={(value) => setConfig((prev) => ({ ...prev, feedback_cycle: value }))}
            onFeedbackFormatChange={(value) => setConfig((prev) => ({ ...prev, feedback_format: value }))}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}