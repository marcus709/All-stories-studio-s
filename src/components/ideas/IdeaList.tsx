import { Button } from "../ui/button";
import { Pencil, Trash2, Tag, Clock } from "lucide-react";

interface IdeaListProps {
  ideas: any[];
  onEdit: (idea: any) => void;
  onDelete: (idea: any) => void;
}

export const IdeaList = ({ ideas, onEdit, onDelete }: IdeaListProps) => {
  return (
    <div className="space-y-4">
      {ideas.map((idea) => (
        <div key={idea.id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <div className="text-purple-500">
                {idea.title.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">{idea.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{idea.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {idea.tag && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span>{idea.tag}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      Created {new Date(idea.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(idea)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(idea)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};