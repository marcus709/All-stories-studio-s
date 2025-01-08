import { Card } from "@/components/ui/card";
import { Template } from "@/types/book";

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
  return (
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
  );
};