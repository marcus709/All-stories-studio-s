import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const CharacterNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-gray-800 border border-gray-700 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />
      <div className="flex flex-col items-center">
        <div className="text-sm font-medium text-gray-300">{data.role || 'Unknown Role'}</div>
        <div className="text-lg font-bold text-white mt-1">{data.name}</div>
        {data.archetype && (
          <div className="text-xs text-gray-400 mt-1">{data.archetype}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" />
    </div>
  );
};

export default memo(CharacterNode);