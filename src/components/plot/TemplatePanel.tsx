import { Card } from "@/components/ui/card";
import { PlotTemplate } from "@/types/plot";

interface TemplatePanelProps {
  templates: PlotTemplate[];
  selectedTemplate: PlotTemplate | null;
  onTemplateSelect: (template: PlotTemplate) => void;
}

export const TemplatePanel = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
}: TemplatePanelProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedTemplate?.id === template.id ? "border-2 border-primary" : ""
          }`}
          onClick={() => onTemplateSelect(template)}
        >
          <h3 className="font-medium">{template.name}</h3>
          <p className="text-sm text-gray-500">{template.genre}</p>
          <div className="mt-2">
            <p className="text-xs text-gray-500">Stages:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {template.stages.map((stage) => (
                <span
                  key={stage}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {stage}
                </span>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};