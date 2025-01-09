import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Character } from '@/integrations/supabase/types/tables.types';

interface CharacterDynamicsD3Props {
  characters: Character[];
  relationships: any[];
}

export const CharacterDynamicsD3 = ({ characters, relationships }: CharacterDynamicsD3Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !characters.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create a gradient for nodes
    const defs = svg.append("defs");
    const gradient = defs.append("radialGradient")
      .attr("id", "node-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#8b5cf6");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6d28d9");

    // Create force simulation
    const simulation = d3.forceSimulation(characters)
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    if (relationships.length > 0) {
      simulation.force("link", d3.forceLink(relationships)
        .id((d: any) => d.id)
        .distance(200));
    }

    // Draw relationships
    const links = svg.append("g")
      .selectAll("line")
      .data(relationships)
      .enter()
      .append("line")
      .style("stroke", "#e5e7eb")
      .style("stroke-width", (d: any) => (d.strength || 50) / 25);

    // Create node groups
    const nodes = svg.append("g")
      .selectAll("g")
      .data(characters)
      .enter()
      .append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles to nodes
    nodes.append("circle")
      .attr("r", 30)
      .style("fill", "url(#node-gradient)")
      .style("stroke", "#4c1d95")
      .style("stroke-width", "2px");

    // Add role labels
    nodes.append("text")
      .attr("dy", -35)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs text-gray-500")
      .text((d: any) => d.role || "Unknown Role");

    // Add name labels
    nodes.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-medium text-white")
      .text((d: any) => d.name);

    // Update positions on each tick
    simulation.on("tick", () => {
      links
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodes.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
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

    // Add zoom capabilities
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", event.transform);
      });

    svg.call(zoom as any);

    return () => {
      simulation.stop();
    };
  }, [characters, relationships]);

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full"
      style={{ background: 'white' }}
    />
  );
};