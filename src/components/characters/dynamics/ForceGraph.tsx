import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CharacterNode, Relationship } from './types';

interface ForceGraphProps {
  characters: CharacterNode[];
  relationships: Relationship[];
}

const relationshipColors = {
  'friend': '#22C55E',     // green for trust/friendship
  'enemy': '#EF4444',      // red for conflict
  'family': '#8B5CF6',     // violet for family bonds
  'mentor': '#F59E0B',     // amber for mentorship
  'student': '#3B82F6',    // blue for learning
  'lover': '#EC4899',      // pink for romance
  'rival': '#F97316',      // orange for rivalry
  'ally': '#06B6D4',       // cyan for alliance
  'neutral': '#9CA3AF'     // gray for undefined
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
      .attr("viewBox", [0, 0, width, height])
      .style("background", "#1a1a1a");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Create a container for the graph
    const g = svg.append("g");

    // Create force simulation
    const simulation = d3.forceSimulation(characters as any)
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60))
      .force("link", d3.forceLink(relationships)
        .id((d: any) => d.id)
        .distance(200));

    // Create a gradient for node backgrounds
    const defs = svg.append("defs");
    
    defs.append("radialGradient")
      .attr("id", "node-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#2a2a2a" },
        { offset: "100%", color: "#1a1a1a" }
      ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    // Add relationships as links
    const links = g.selectAll("line")
      .data(relationships)
      .enter()
      .append("line")
      .style("stroke", d => relationshipColors[d.type] || relationshipColors.neutral)
      .style("stroke-width", d => Math.max(1, Math.min(d.strength / 20, 5)))
      .style("opacity", 0.6);

    // Create node groups
    const nodeGroups = g.selectAll("g")
      .data(characters)
      .enter()
      .append("g")
      .attr("class", "character-node")
      .style("cursor", "pointer");

    // Add circular backgrounds
    nodeGroups.append("circle")
      .attr("r", 35)
      .style("fill", "url(#node-gradient)")
      .style("stroke", "#6366F1")
      .style("stroke-width", 2);

    // Add text labels
    nodeGroups.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 50)
      .style("fill", "#E5E7EB")
      .style("font-size", "12px")
      .style("font-weight", "500");

    // Add role labels
    nodeGroups.append("text")
      .text(d => d.role || "")
      .attr("text-anchor", "middle")
      .attr("dy", -40)
      .style("fill", "#9CA3AF")
      .style("font-size", "10px");

    // Add drag behavior
    const drag = d3.drag<SVGGElement, any>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    nodeGroups.call(drag as any);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      links
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      nodeGroups.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
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
      className="rounded-xl"
    />
  );
}