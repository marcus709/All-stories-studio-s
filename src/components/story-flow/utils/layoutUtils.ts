export const getLayoutedElements = (nodes: any[], edges: any[], type: 'linear' | 'branching' | 'network') => {
  const spacing = 100;
  
  if (type === 'linear') {
    return {
      nodes: nodes.map((node, index) => ({
        ...node,
        position: { x: index * 250, y: 100 },
      })),
      edges,
    };
  } else if (type === 'branching') {
    return {
      nodes: nodes.map((node, index) => {
        const level = Math.floor(index / 2);
        const offset = index % 2 === 0 ? -150 : 150;
        return {
          ...node,
          position: { 
            x: level * 300,
            y: 100 + offset
          },
        };
      }),
      edges,
    };
  } else {
    const radius = 200;
    const angleStep = (2 * Math.PI) / nodes.length;
    
    return {
      nodes: nodes.map((node, index) => ({
        ...node,
        position: {
          x: 300 + radius * Math.cos(index * angleStep),
          y: 300 + radius * Math.sin(index * angleStep),
        },
      })),
      edges,
    };
  }
};