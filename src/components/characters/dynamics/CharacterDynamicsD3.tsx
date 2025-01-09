import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Character } from '@/integrations/supabase/types/tables.types';
import { RelationshipType } from '@/types/relationships';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface CharacterDynamicsD3Props {
  characters: Character[];
}

const relationshipColors: Record<RelationshipType, string> = {
  'ally': '#22c55e',
  'rival': '#ef4444',
  'family': '#8b5cf6',
  'friend': '#3b82f6',
  'enemy': '#dc2626',
  'mentor': '#f59e0b',
  'student': '#6366f1',
};

export const CharacterDynamicsD3 = ({ characters }: CharacterDynamicsD3Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [synergy, setSynergy] = useState(75);

  const { data: relationships } = useQuery({
    queryKey: ['relationships', characters.map(c => c.id)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_relationships')
        .select('*')
        .in('character1_id', characters.map(c => c.id));
      if (error) throw error;
      return data;
    },
    enabled: characters.length > 0,
  });

  useEffect(() => {
    if (!svgRef.current || !characters || !relationships) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);

    // Create force simulation
    const simulation = d3.forceSimulation(characters)
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Add relationships as links
    const links = svg.selectAll("line")
      .data(relationships)
      .enter()
      .append("line")
      .style("stroke", d => relationshipColors[d.relationship_type])
      .style("stroke-width", d => Math.max(1, Math.min(d.strength / 20, 5)));

    // Add character nodes
    const nodes = svg.selectAll("g")
      .data(characters)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles for nodes
    nodes.append("circle")
      .attr("r", 30)
      .style("fill", "white")
      .style("stroke", "#000")
      .style("stroke-width", 2);

    // Add text labels
    nodes.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-size", "12px");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      links
        .attr("x1", d => {
          const source = characters.find(c => c.id === d.character1_id);
          return source?.x || 0;
        })
        .attr("y1", d => {
          const source = characters.find(c => c.id === d.character1_id);
          return source?.y || 0;
        })
        .attr("x2", d => {
          const target = characters.find(c => c.id === d.character2_id);
          return target?.x || 0;
        })
        .attr("y2", d => {
          const target = characters.find(c => c.id === d.character2_id);
          return target?.y || 0;
        });

      nodes
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Add ripple effect when nodes are added
    nodes.append("circle")
      .attr("r", 0)
      .style("fill", "none")
      .style("stroke", "#9333ea")
      .style("stroke-width", 2)
      .style("opacity", 1)
      .transition()
      .duration(1000)
      .attr("r", 60)
      .style("opacity", 0)
      .remove();

    return () => {
      simulation.stop();
    };
  }, [characters, relationships]);

  const handleTimelineChange = (value: number[]) => {
    setTimelinePosition(value[0]);
    // Update relationships based on timeline position
    // This will be implemented in the next iteration
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Implement timeline playback animation
    // This will be implemented in the next iteration
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Group Synergy</div>
          <div className="text-2xl font-bold text-purple-600">{synergy}%</div>
        </div>
        <Button variant="outline" onClick={togglePlayback} className="gap-2">
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Play Timeline
            </>
          )}
        </Button>
      </div>

      <div className="h-[500px] bg-white rounded-xl shadow-sm relative">
        <svg ref={svgRef} width="100%" height="100%" />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm font-medium mb-2">Timeline</div>
        <Slider
          value={[timelinePosition]}
          onValueChange={handleTimelineChange}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>Story Start</span>
          <span>Current Event</span>
          <span>Story End</span>
        </div>
      </div>
    </div>
  );
};