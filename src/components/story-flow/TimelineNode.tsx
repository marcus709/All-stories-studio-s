import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { TimelineNodeData } from './types/timeline';
import { TimelineNodeFields } from './TimelineNodeFields';
import { TimelineNodeMenu } from './TimelineNodeMenu';

const TimelineNode = ({ data, id }: NodeProps<TimelineNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(data.label);
  const [editedSubtitle, setEditedSubtitle] = useState(data.subtitle || '');
  const [editedYear, setEditedYear] = useState(data.year || '');

  const handleSave = () => {
    // Save functionality will be handled by the parent component
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLabel(data.label);
    setEditedSubtitle(data.subtitle || '');
    setEditedYear(data.year || '');
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 min-w-[200px]">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-indigo-500"
      />
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
          handleDoubleClick={() => setIsEditing(true)}
          data={data}
        />
        <TimelineNodeMenu
          handleEdit={() => setIsEditing(true)}
          handleAddConnection={() => {}}
          handleDelete={() => {}}
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-indigo-500"
      />
    </div>
  );
};

export default memo(TimelineNode);