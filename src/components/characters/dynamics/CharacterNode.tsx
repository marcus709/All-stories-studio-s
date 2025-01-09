import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const CharacterNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-gray-800 border border-gray-700 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />
      <div className="text-white font-medium">{data.name}</div>
      {data.role && (
        <div className="text-gray-400 text-sm mt-1">{data.role}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" />
    </div>
  );
};

export default memo(CharacterNode);