import { Card } from "@/components/ui/card";
import { Template } from "@/types/book";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
          <h3 className="text-lg font-semibold">AI Configuration</h3>
          
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