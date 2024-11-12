import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface LeaderboardProps {
  leaderboard?: { name: string; score: number }[]; // Made leaderboard optional
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard = [] }) => { // Default to empty array if undefined
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!leaderboard || leaderboard.length === 0) return; // Exit if leaderboard is empty

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = 400;
    const height = 300;
    const padding = 40;

    const xScale = d3
      .scaleBand()
      .domain(leaderboard.map((player) => player.name))
      .range([padding, width - padding])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(leaderboard, (d) => d.score) || 0])
      .range([height - padding, padding]);

    svg.attr('width', width).attr('height', height);

    svg
      .selectAll('rect')
      .data(leaderboard)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.name)!)
      .attr('y', (d) => yScale(d.score)!)
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - padding - yScale(d.score)!)
      .attr('fill', 'steelblue');

    svg.append('g').attr('transform', `translate(0, ${height - padding})`).call(d3.axisBottom(xScale));
    svg.append('g').attr('transform', `translate(${padding}, 0)`).call(d3.axisLeft(yScale));
  }, [leaderboard]);

  return <svg ref={svgRef}></svg>;
};

export default Leaderboard;
