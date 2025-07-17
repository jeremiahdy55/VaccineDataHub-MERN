import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const PieChart = ({ data, populationSize, chartTitle }) => {
  const containerRef = useRef();
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // ResizeObserver to watch container size
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  // Render pie chart when data or size changes
  useEffect(() => {
    if (!data || data.length === 0 || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const radius = Math.min(width, height) / 2;
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll("*").remove();

    // create svg "container"
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 3}, ${height / 2})`);

    // draw the pie chart by wedge
    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const pieData = pie(data);

    svg
      .selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (_, i) => colors(i))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);
    
    // ==== Render labels to the right of the chart =====
    const labelGroup = svg
      .append("g")
      .attr("transform", `translate(${radius + 40}, ${-radius + 30})`);

    // add little color square to match the pie wedge
    labelGroup
      .selectAll("rect")
      .data(pieData)
      .enter()
      .append("rect")
      .attr("x", -15)
      .attr("y", (_, i) => i * 50 - 10)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (_, i) => colors(i));

    // create text labels
    labelGroup
      .selectAll("text")
      .data(pieData)
      .enter()
      .append("text")
      .text(
        (d) =>
          `${d.data.label}: ${((d.data.value / populationSize) * 100).toFixed(2)}%`
      )
      .attr("y", (_, i) => i * 50) // vertical spacing
      .attr("x", 0)
      .style("font-size", "0.85rem")
      .style("text-anchor", "start");
  }, [data, dimensions]);

  return (
    <div ref={containerRef} style={{ width: "95%", height: "100%" }}>
      <h4 className="ms-3">
        <strong>{chartTitle}</strong>
      </h4>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PieChart;
