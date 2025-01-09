import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CharacterNode, RelationshipLink } from './types';

interface ForceGraphProps {
  characters: CharacterNode[];
  relationships: RelationshipLink[];
}

const relationshipColors = {
  'friend': '#22C55E',     // green-500
  'enemy': '#EF4444',      // red-500
  'family': '#8B5CF6',     // violet-500
  'mentor': '#F59E0B',     // amber-500
  'student': '#3B82F6',    // blue-500
  'lover': '#EC4899',      // pink-500
  'rival': '#F97316',      // orange-500
  'ally': '#06B6D4',       // cyan-500
  'business': '#6366F1',   // indigo-500
  'default': '#9CA3AF'     // gray-400
};

export function ForceGraph({ characters, relationships }: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !characters || !relationships) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Create force simulation
    const simulation = d3.forceSimulation(characters)
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50))
      .force("link", d3.forceLink(relationships)
        .id((d: any) => d.id)
        .distance(150));

    // Add relationships as links with animations
    const links = svg.selectAll("line")
      .data(relationships)
      .enter()
      .append("line")
      .style("stroke", d => relationshipColors[d.type as keyof typeof relationshipColors] || relationshipColors.default)
      .style("stroke-width", d => Math.max(1, Math.min(d.strength / 20, 5)))
      .style("opacity", 0)
      .transition()
      .duration(800)
      .style("opacity", 1);

    // Create node groups with animations
    const nodes = svg.selectAll("g")
      .data(characters)
      .enter()
      .append("g")
      .attr("class", "character-node")
      .style("opacity", 0)
      .transition()
      .duration(800)
      .style("opacity", 1);

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
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // Add drag behavior
    const drag = d3.drag<SVGGElement, CharacterNode>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    svg.selectAll("g").call(drag as any);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      svg.selectAll("line")
        .attr("x1", d => (d.source as CharacterNode).x || 0)
        .attr("y1", d => (d.source as CharacterNode).y || 0)
        .attr("x2", d => (d.target as CharacterNode).x || 0)
        .attr("y2", d => (d.target as CharacterNode).y || 0);

      svg.selectAll("g")
        .attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Drag functions
    function dragstarted(event: any, d: CharacterNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: CharacterNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: CharacterNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [characters, relationships]);

  return (
    <svg 
      ref={svgRef} 
      width="100%" 
      height="100%" 
      className="bg-white rounded-lg shadow-sm"
    />
  );
}