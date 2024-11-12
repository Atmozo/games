// src/components/WordChart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface WordChartProps {
  words: string[];
}

const WordChart: React.FC<WordChartProps> = ({ words }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const data = words.map((word) => word.length);
    const width = 300;
    const height = 200;
    const xScale = d3.scaleBand().domain(data.map((_, i) => i.toString())).range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().domain([0, d3.max(data) || 0]).range([height, 0]);

    svg.attr("width", width).attr("height", height);
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScale(i.toString())!)
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d))
      .attr("fill", "steelblue");

    svg.append("g").call(d3.axisLeft(yScale));
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
  }, [words]);

  return <svg ref={svgRef}></svg>;
};

export default WordChart;