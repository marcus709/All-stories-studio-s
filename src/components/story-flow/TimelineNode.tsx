import { useState } from 'react';
import { useNodesState } from '@xyflow/react';
import { useToast } from "@/hooks/use-toast";
import { TimelineNodeFields } from './TimelineNodeFields';
import { TimelineNodeMenu } from './TimelineNodeMenu';
import { Card } from "@/components/ui/card";

export const TimelineNode = ({ data, id }: { data: any; id: string }) => {
  const { toast } = useToast();
  const [nodes, setNodes] = useNodesState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(data.label);
  const [editedSubtitle, setEditedSubtitle] = useState(data.subtitle);
  const [editedYear, setEditedYear] = useState(data.year);

  const handleEdit = () => {
    setIsEditing(true);
    toast({
      title: "Edit Event",
      description: `Editing event: ${data.label}`,
    });
  };

  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    toast({
      title: "Delete Event",
      description: `Deleted event: ${data.label}`,
      variant: "destructive"
    });
  };

  const handleAddConnection = () => {
    toast({
      title: "Add Connection",
      description: `Adding connection from: ${data.label}`,
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    data.label = editedLabel;
    data.subtitle = editedSubtitle;
    data.year = editedYear;
    
    toast({
      title: "Success",
      description: "Event details saved successfully",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedLabel(data.label);
    setEditedSubtitle(data.subtitle);
    setEditedYear(data.year);
  };

  return (
    <Card className="min-w-[250px] bg-white shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <TimelineNodeFields
            isEditing={isEditing}
            editedLabel={editedLabel}
            editedSubtitle={editedSubtitle}
            editedYear={editedYear}
            setEditedLabel={setEditedLabel}
            setEditedSubtitle={setEditedSubtitle}
            setEditedYear={setEditedYear}
            handleSave={handleSave}
            handleCancel={handleCancel}
            handleDoubleClick={handleDoubleClick}
            data={data}
          />
          <TimelineNodeMenu
            handleEdit={handleEdit}
            handleAddConnection={handleAddConnection}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </Card>
  );
};