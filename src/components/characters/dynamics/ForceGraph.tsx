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
      .style("stroke", d => relationshipColors[d.type as keyof typeof relationshipColors] || relationshipColors.default)
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
        .attr("x1", d => d.source.x || 0)
        .attr("y1", d => d.source.y || 0)
        .attr("x2", d => d.target.x || 0)
        .attr("y2", d => d.target.y || 0);

      nodes
        .attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
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

    return () => {
      simulation.stop();
    };
  }, [characters, relationships]);

  return <svg ref={svgRef} width="100%" height="100%" />;
}