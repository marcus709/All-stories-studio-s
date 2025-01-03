import { useState } from 'react';
import { useNodesState } from '@xyflow/react';
import { useToast } from "@/hooks/use-toast";
import { TimelineNodeFields } from './TimelineNodeFields';
import { TimelineNodeMenu } from './TimelineNodeMenu';

export const TimelineNode = ({ data, id }: { data: any; id: string }) => {
  const { toast } = useToast();
  const [nodes, setNodes] = useNodesState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(data.label);
  const [editedSubtitle, setEditedSubtitle] = useState(data.subtitle);
  const [editedYear, setEditedYear] = useState(data.year);

  const handleEdit = () => {
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

  const handleBlur = () => {
    setIsEditing(false);
    data.label = editedLabel;
    data.subtitle = editedSubtitle;
    data.year = editedYear;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      handleBlur();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 min-w-[200px]">
      <div className="flex justify-between items-start mb-2">
        <TimelineNodeFields
          isEditing={isEditing}
          editedLabel={editedLabel}
          editedSubtitle={editedSubtitle}
          editedYear={editedYear}
          setEditedLabel={setEditedLabel}
          setEditedSubtitle={setEditedSubtitle}
          setEditedYear={setEditedYear}
          handleBlur={handleBlur}
          handleKeyDown={handleKeyDown}
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
  );
};