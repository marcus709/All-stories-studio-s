import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

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

  useEffect(() => {
    if (!svgRef.current || !tensionPoints.length) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(tensionPoints, d => d.position) || 0])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    // Create line generator
    const line = d3.line<TensionPoint>()
      .x(d => xScale(d.position))
      .y(d => yScale(d.tension_level))
      .curve(d3.curveMonotoneX);

    // Create gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "tension-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ef4444");

    gradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#22c55e");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3b82f6");

    // Draw line
    svg.append("path")
      .datum(tensionPoints)
      .attr("fill", "none")
      .attr("stroke", "url(#tension-gradient)")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add points
    svg.selectAll("circle")
      .data(tensionPoints)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.position))
      .attr("cy", d => yScale(d.tension_level))
      .attr("r", 4)
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6);

        tooltip
          .style("opacity", 1)
          .html(`${d.description}<br/>Tension: ${d.tension_level}%`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 4);

        tooltip.style("opacity", 0);
      });

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    // Add tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden transform -translate-x-1/2 px-3 py-2 bg-black/80 text-white text-sm rounded pointer-events-none")
      .style("opacity", 0);

    return () => {
      tooltip.remove();
    };
  }, [tensionPoints]);

  return (
    <div className="w-full h-full bg-gray-50">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};