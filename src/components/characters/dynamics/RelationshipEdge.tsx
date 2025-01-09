import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface RelationshipEdgeData {
  type: string;
  strength: number;
  notes: string;
  trust: number;
  conflict: number;
  chemistry: string;
}

const RelationshipEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<RelationshipEdgeData>) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <HoverCard>
            <HoverCardTrigger asChild>
              <div 
                className="w-6 h-6 rounded-full bg-gray-800 border border-gray-600 
                          flex items-center justify-center cursor-pointer
                          hover:bg-gray-700 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-current" style={{ color: style.stroke }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-gray-800 border-gray-700 text-white p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Trust</span>
                  <span>{data?.trust}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data?.trust}%` }}
                  />
                </div>
                
                <div className="flex justify-between">
                  <span>Conflict</span>
                  <span>{data?.conflict}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data?.conflict}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span>Chemistry</span>
                  <span className="text-purple-400">{data?.chemistry}</span>
                </div>
                
                {data?.notes && (
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-sm text-gray-400">{data.notes}</p>
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(RelationshipEdge);