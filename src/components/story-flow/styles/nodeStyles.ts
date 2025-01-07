import { Node } from '@xyflow/react';

export const getNodeStyle = (viewMode: string, index: number, total: number) => {
  const baseStyle = {
    padding: '16px',
    borderRadius: '8px',
    minWidth: '200px',
    background: 'white',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  };

  switch (viewMode) {
    case 'timeline':
      return {
        ...baseStyle,
        borderLeft: '4px solid #818cf8',
      };
    
    case 'cluster':
      return {
        ...baseStyle,
        borderRadius: '16px',
        background: `rgba(129, 140, 248, ${0.1 + (index / total) * 0.2})`,
      };
    
    case 'grid':
      return {
        ...baseStyle,
        aspectRatio: '1',
        minWidth: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
    
    case 'spiral':
      return {
        ...baseStyle,
        borderRadius: '50%',
        aspectRatio: '1',
        minWidth: index === 0 ? '200px' : '150px',
        background: index === 0 ? '#818cf8' : 'white',
        color: index === 0 ? 'white' : 'inherit',
      };
    
    case 'tree':
      return {
        ...baseStyle,
        borderLeft: '4px solid #818cf8',
        minWidth: '180px',
      };
    
    case 'flowchart':
      return {
        ...baseStyle,
        borderRadius: '4px',
        background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
      };
    
    case 'mindmap':
      return {
        ...baseStyle,
        borderRadius: index === 0 ? '50%' : '8px',
        minWidth: index === 0 ? '200px' : '180px',
        background: index === 0 ? '#818cf8' : 'white',
        color: index === 0 ? 'white' : 'inherit',
      };
    
    case 'concentric':
      return {
        ...baseStyle,
        borderRadius: '12px',
        background: `rgba(129, 140, 248, ${0.8 - (index / total) * 0.6})`,
        color: index === 0 ? 'white' : 'inherit',
      };
    
    case 'hexagonal':
      return {
        ...baseStyle,
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        minWidth: '180px',
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
      };
    
    case 'starburst':
      return {
        ...baseStyle,
        borderRadius: index === 0 ? '50%' : '8px',
        minWidth: index === 0 ? '200px' : '150px',
        background: index === 0 ? '#818cf8' : 'white',
        color: index === 0 ? 'white' : 'inherit',
      };
    
    case 'pathway':
      return {
        ...baseStyle,
        borderRadius: '999px',
        minWidth: '160px',
        background: 'linear-gradient(45deg, #818cf8, #6366f1)',
        color: 'white',
      };
    
    case 'layered':
      return {
        ...baseStyle,
        borderLeft: '4px solid #818cf8',
        opacity: 1 - (index / total) * 0.3,
      };
    
    case 'sphere':
    case 'fractal':
      return {
        ...baseStyle,
        borderRadius: '50%',
        minWidth: '160px',
        aspectRatio: '1',
        background: `rgba(129, 140, 248, ${0.2 + (index / total) * 0.3})`,
      };
    
    default:
      return baseStyle;
  }
};