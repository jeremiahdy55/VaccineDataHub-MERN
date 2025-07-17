import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const BarChart = ({ data, populationSize, chartTitle }) => {
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

  // Render bar chart when data or size changes
  useEffect(() => {
    if (!data || data.length === 0 || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const margin = {
      top: height * 0.05,
      bottom: height * 0.1,
      right: width * 0.05,
      left: width * 0.15,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // define chart "container"
    const chart = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // x-axis
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([0, innerWidth]);

    // y-axis
    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerHeight])
      .padding(0.3);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add vertical grid lines FIRST (before bars)
    chart
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${innerHeight})`) // x-axis is at bottom
      .call(d3.axisBottom(x).ticks(8).tickSize(-innerHeight).tickFormat(""))
      .selectAll("line")
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "2,2"); // optional: dashed lines

    // Draw bars
    chart
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d.label))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (_, i) => color(i));

    // Add y-axis (category labels)
    chart.append("g").call(d3.axisLeft(y));
    // add tick mark labels
    chart
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x).ticks(8).tickSizeOuter(0));
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

export default BarChart;
