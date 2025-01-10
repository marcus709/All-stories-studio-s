import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useStory } from '@/contexts/StoryContext';

interface TensionPoint {
  id: string;
  position: number;
  tension_level: number;
  description: string;
  type: 'rising' | 'falling' | 'climax' | 'resolution';
}

interface TensionTimelineProps {
  tensionPoints: TensionPoint[];
}

export const TensionTimeline = ({ tensionPoints }: TensionTimelineProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddPoint = async (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isAdding || !svgRef.current || !selectedStory?.id) return;

    const svg = d3.select(svgRef.current);
    const bounds = svg.node()?.getBoundingClientRect();
    if (!bounds) return;

    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([50, bounds.width - 50]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([bounds.height - 30, 30]);

    const xPos = d3.pointer(event)[0];
    const yPos = d3.pointer(event)[1];

    const position = Math.round(xScale.invert(xPos));
    const tension = Math.round(yScale.invert(yPos));

    try {
      const { error } = await supabase
        .from('timeline_tension_points')
        .insert({
          story_id: selectedStory.id,
          position,
          tension_level: tension,
          type: 'rising',
          description: `Tension point at ${position}%`
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Added new tension point",
      });
      
      setIsAdding(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tension point",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!svgRef.current || !tensionPoints.length) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .on("click", isAdding ? handleAddPoint : null);

    // Add gradient definitions
    const defs = svg.append("defs");

    // Create gradient for the area
    const areaGradient = defs.append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    areaGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(239, 68, 68, 0.2)"); // Red with opacity

    areaGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(239, 68, 68, 0)");

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    // Create line generator
    const line = d3.line<TensionPoint>()
      .x(d => xScale(d.position))
      .y(d => yScale(d.tension_level))
      .curve(d3.curveCatmullRom);

    // Create area generator
    const area = d3.area<TensionPoint>()
      .x(d => xScale(d.position))
      .y0(height - margin.bottom)
      .y1(d => yScale(d.tension_level))
      .curve(d3.curveCatmullRom);

    // Add grid
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(xScale)
          .ticks(10)
          .tickSize(-height + margin.top + margin.bottom)
          .tickFormat(() => "")
      )
      .style("stroke", "rgba(255,255,255,0.1)");

    // Add area
    svg.append("path")
      .datum(tensionPoints)
      .attr("fill", "url(#areaGradient)")
      .attr("d", area);

    // Add line
    svg.append("path")
      .datum(tensionPoints)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Add points
    svg.selectAll("circle")
      .data(tensionPoints)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.position))
      .attr("cy", d => yScale(d.tension_level))
      .attr("r", 6)
      .attr("fill", "#ef4444")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8);

        const tooltip = d3.select("body").append("div")
          .attr("class", "absolute hidden transform -translate-x-1/2 px-3 py-2 bg-black/80 text-white text-sm rounded pointer-events-none")
          .style("opacity", 0);

        tooltip.transition()
          .duration(200)
          .style("opacity", 1);

        tooltip.html(`${d.description}<br/>Tension: ${d.tension_level}%`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6);

        d3.selectAll(".tooltip").remove();
      });

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => `${d}%`);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d}%`);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style("color", "#9ca3af");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .style("color", "#9ca3af");

  }, [tensionPoints, isAdding]);

  return (
    <div className="w-full h-full bg-gray-900 relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant={isAdding ? "destructive" : "default"}
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAdding ? "Cancel" : "Add Point"}
        </Button>
      </div>
      <svg 
        ref={svgRef} 
        className="w-full h-full cursor-crosshair"
        style={{ background: '#111827' }}
      />
    </div>
  );
};