
import { memo, useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  
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
    <div 
      className={`${getNodeClasses()} group px-4 py-2 shadow-lg rounded-full 
                 bg-gray-800 border-2 ${getBorderColor(data.traits)} 
                 min-w-[120px] min-h-[120px] flex flex-col items-center justify-center
                 transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]
                 ${isHovered ? 'scale-110' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`!bg-purple-500 ${isHovered ? '!w-6 !h-6' : ''} transition-all duration-300`} 
      />
      
      <div className="relative w-16 h-16 mb-2 rounded-full bg-gray-700 flex items-center justify-center
                     transition-transform duration-300 group-hover:scale-110">
        <UserCircle className={`w-12 h-12 ${isHovered ? 'text-purple-300' : 'text-purple-400'} transition-colors duration-300`} />
        {data.isNew && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors duration-300">{data.name}</div>
        {data.role && (
          <div className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-300">{data.role}</div>
        )}
        {data.archetype && (
          <div className="text-xs text-purple-400 mt-1 group-hover:text-purple-300 transition-colors duration-300">{data.archetype}</div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`!bg-purple-500 ${isHovered ? '!w-6 !h-6' : ''} transition-all duration-300`} 
      />
    </div>
  );
};

export default memo(CharacterNode);
