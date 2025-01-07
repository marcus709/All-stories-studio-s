import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { TimelineNodeData } from './types/timeline';

const TimelineNode = ({ data }: NodeProps<TimelineNodeData>) => {
  return (
    <div className="p-4">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-indigo-500"
      />
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-sm">{data.label}</h3>
        {data.subtitle && (
          <p className="text-xs text-gray-500">{data.subtitle}</p>
        )}
        {data.year && (
          <span className="text-xs font-medium text-indigo-500">{data.year}</span>
        )}
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