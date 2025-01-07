import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface RelationshipNodeProps {
  data: {
    label: string;
    isActive?: boolean;
  };
}

const RelationshipNode = ({ data }: RelationshipNodeProps) => {
  return (
    <div
      className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors
        ${data.isActive 
          ? 'bg-black border-black text-white' 
          : 'bg-white border-black text-black'
        }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-black border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-black border-2 border-white"
      />
      <div className="text-xs font-medium truncate max-w-[40px]">
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-black border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-black border-2 border-white"
      />
    </div>
  );
};

export default memo(RelationshipNode);