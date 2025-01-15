import { Card } from "@/components/ui/card";
import { Template } from "@/types/book";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface TemplatePanelProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
}

export const TemplatePanel = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
}: TemplatePanelProps) => {
  const session = useSession();
  const { toast } = useToast();

  const { data: aiConfigurations = [] } = useQuery({
    queryKey: ["aiConfigurations", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("ai_configurations")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch AI configurations",
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleAIConfigChange = (field: keyof Template['aiConfig'], value: any) => {
    if (!selectedTemplate) return;

    const updatedTemplate = {
      ...selectedTemplate,
      aiConfig: {
        ...selectedTemplate.aiConfig,
        [field]: value
      }
    };
    onTemplateSelect(updatedTemplate);
  };

  const handleApplyAIConfig = async (configId: string) => {
    const selectedConfig = aiConfigurations.find(config => config.id === configId);
    if (!selectedConfig || !selectedTemplate) return;

    const updatedTemplate = {
      ...selectedTemplate,
      aiConfig: {
        tone: selectedConfig.tone,
        style: selectedConfig.response_style,
        focusAreas: selectedConfig.focus_area.split(','),
        customInstructions: selectedConfig.custom_prompt
      }
    };
    onTemplateSelect(updatedTemplate);

    toast({
      title: "Success",
      description: "AI configuration applied to template",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:scale-105 ${
              selectedTemplate?.id === template.id
                ? "ring-2 ring-violet-500"
                : "hover:border-violet-500"
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <div
              className="aspect-[2/3] rounded-md mb-2"
              style={{
                background: `linear-gradient(to bottom right, ${template.colors.join(
                  ", "
                )})`,
              }}
            />
            <p className="text-sm text-center font-medium">{template.name}</p>
            <p className="text-xs text-center text-gray-500">{template.genre}</p>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-8 space-y-6 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Configuration</h3>
            
            <Select
              onValueChange={handleApplyAIConfig}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Apply AI Config" />
              </SelectTrigger>
              <SelectContent>
                {aiConfigurations.map((config) => (
                  <SelectItem key={config.id} value={config.id}>
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Writing Tone</Label>
              <Select
                value={selectedTemplate.aiConfig?.tone || 'professional'}
                onValueChange={(value) => handleAIConfigChange('tone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Writing Style</Label>
              <Select
                value={selectedTemplate.aiConfig?.style || 'descriptive'}
                onValueChange={(value) => handleAIConfigChange('style', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="descriptive">Descriptive</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="narrative">Narrative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Focus Areas</Label>
              <div className="grid grid-cols-2 gap-4">
                {['character', 'plot', 'setting', 'theme'].map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={selectedTemplate.aiConfig?.focusAreas?.includes(area as any)}
                      onCheckedChange={(checked) => {
                        const currentAreas = selectedTemplate.aiConfig?.focusAreas || [];
                        const newAreas = checked 
                          ? [...currentAreas, area]
                          : currentAreas.filter(a => a !== area);
                        handleAIConfigChange('focusAreas', newAreas);
                      }}
                    />
                    <Label htmlFor={area} className="capitalize">{area}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Custom Instructions</Label>
              <Textarea
                value={selectedTemplate.aiConfig?.customInstructions || ''}
                onChange={(e) => handleAIConfigChange('customInstructions', e.target.value)}
                placeholder="Add any specific instructions for the AI..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};