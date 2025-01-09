import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Character } from '@/integrations/supabase/types/tables.types';

interface CharacterDynamicsD3Props {
  characters: Character[];
  relationships: any[];
}

export const CharacterDynamicsD3 = ({ characters, relationships }: CharacterDynamicsD3Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Character | null>(null);

  useEffect(() => {
    if (!svgRef.current || !characters.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Create definitions for gradients and markers
    const defs = svg.append("defs");

    // Add arrow marker for relationship lines
    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#64748b")
      .attr("d", "M0,-5L10,0L0,5");

    // Create radial gradient for nodes
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
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(70))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    if (relationships.length > 0) {
      simulation.force("link", d3.forceLink(relationships)
        .id((d: any) => d.id)
        .distance(200)
        .strength(0.5));
    }

    // Create container for zoom/pan
    const container = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Draw relationships
    const links = container.append("g")
      .selectAll("line")
      .data(relationships)
      .enter()
      .append("line")
      .attr("class", "relationship-line")
      .style("stroke", "#64748b")
      .style("stroke-width", (d: any) => Math.max(1, Math.min((d.strength || 50) / 25, 5)))
      .attr("marker-end", "url(#arrow)")
      .style("opacity", 0.6);

    // Create node groups
    const nodes = container.append("g")
      .selectAll("g")
      .data(characters)
      .enter()
      .append("g")
      .attr("class", "character-node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(selectedNode?.id === d.id ? null : d);
      });

    // Add node circles
    nodes.append("circle")
      .attr("r", 35)
      .style("fill", "url(#node-gradient)")
      .style("stroke", "#4c1d95")
      .style("stroke-width", "2px")
      .style("cursor", "pointer")
      .transition()
      .duration(800)
      .attrTween("r", () => {
        const i = d3.interpolate(0, 35);
        return (t) => i(t);
      });

    // Add role labels
    nodes.append("text")
      .attr("dy", -40)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs text-gray-400")
      .text((d: any) => d.role || "Unknown Role")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1);

    // Add name labels
    nodes.append("text")
      .attr("dy", 45)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-medium text-gray-200")
      .text((d: any) => d.name)
      .style("pointer-events", "none")
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1);

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

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [characters, relationships, selectedNode]);

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full bg-gray-900"
    />
  );
};