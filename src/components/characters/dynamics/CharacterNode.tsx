
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { UserCircle } from 'lucide-react';

interface NodeData {
  name: string;
  role?: string;
  traits?: string[];
  archetype?: string;
  relationship_type?: string;
  isAffected?: boolean;
  isNew?: boolean;
}

const CharacterNode = ({ data }: { data: NodeData }) => {
  const getBorderColor = (traits: string[] = []) => {
    if (traits.includes('ally')) return 'border-green-500';
    if (traits.includes('enemy')) return 'border-red-500';
    return 'border-purple-500';
  };

  const getNodeClasses = () => {
    let classes = 'character-node';
    if (data.isAffected) classes += ' affected';
    if (data.isNew) classes += ' new';
    return classes;
  };

  return (
    <div className={`${getNodeClasses()} group px-4 py-2 shadow-lg rounded-full bg-gray-800 border-2 ${getBorderColor(data.traits)} 
                    min-w-[120px] min-h-[120px] flex flex-col items-center justify-center
                    transition-shadow duration-200 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]`}>
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />
      
      <div className="relative w-16 h-16 mb-2 rounded-full bg-gray-700 flex items-center justify-center">
        <UserCircle className="w-12 h-12 text-purple-400" />
      </div>

      <div className="flex flex-col items-center">
        <div className="text-lg font-bold text-white">{data.name}</div>
        {data.role && (
          <div className="text-sm text-gray-400 mt-1">{data.role}</div>
        )}
        {data.archetype && (
          <div className="text-xs text-purple-400 mt-1">{data.archetype}</div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" />
    </div>
  );
};

export default memo(CharacterNode);
