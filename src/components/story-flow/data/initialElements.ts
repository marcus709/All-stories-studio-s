import { TimelineNode, TimelineEdge } from '../types/timeline';

export const initialNodes: TimelineNode[] = [
  {
    id: '1',
    type: 'timeline',
    position: { x: 0, y: 0 },
    data: {
      label: 'Story Beginning',
      subtitle: 'The journey starts',
      year: '2024',
    },
  },
  {
    id: '2',
    type: 'timeline',
    position: { x: 200, y: 0 },
    data: {
      label: 'Rising Action',
      subtitle: 'Conflict emerges',
      year: '2024',
    },
  },
  {
    id: '3',
    type: 'timeline',
    position: { x: 400, y: 0 },
    data: {
      label: 'Climax',
      subtitle: 'Peak tension',
      year: '2024',
    },
  },
];

export const initialEdges: TimelineEdge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];