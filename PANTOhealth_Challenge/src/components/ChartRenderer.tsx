import * as d3 from "d3";
import { useEffect, useRef } from "react";
import {
  isMultiSeries,
  type ChartDataType,
  type ChartType,
} from "../types/types";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
const COLORS = ["#1f77b4", "#2ca02c", "#d62728"]; // Blue, Green, Red

const ChartRenderer = ({ title, data }: ChartDataType) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartType: ChartType = isMultiSeries(data) ? "multi" : "single";

  useEffect(() => {
    if (!data.length || !svgRef.current || !wrapperRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const wrapperWidth = wrapperRef.current.clientWidth;
    const width = wrapperWidth - MARGIN.left - MARGIN.right;
    const height = 400 - MARGIN.top - MARGIN.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", wrapperWidth)
      .attr("height", height + MARGIN.top + MARGIN.bottom)
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const timestamps = data.map((d) => d[0]);

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(timestamps) || 0, d3.max(timestamps) || 100])
      .range([0, width]);

    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    let yMin = Infinity;
    let yMax = -Infinity;

    if (chartType === "single") {
      const values = data
        .map((d) => d[1] as number | null)
        .filter((v) => v !== null) as number[];
      if (values.length) {
        yMin = d3.min(values) || 0;
        yMax = d3.max(values) || 100;
      }
    } else {
      const allValues = data.flatMap((d) =>
        (d[1] as (number | null)[]).filter((v) => v !== null)
      ) as number[];
      if (allValues.length) {
        yMin = d3.min(allValues) || 0;
        yMax = d3.max(allValues) || 100;
      }
    }

    yScale.domain([yMin - 5, yMax + 5]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));

    const line = d3
      .line<[number, number | null]>()
      .defined((d) => d[1] !== null)
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1] as number));

    if (chartType === "single") {
      const singleData = data.map((d) => [d[0], d[1]]) as [
        number,
        number | null
      ][];
      svg
        .append("path")
        .datum(singleData)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", line);
    } else {
      const seriesCount = 3;
      for (let i = 0; i < seriesCount; i++) {
        const seriesData = data.map((d) => [
          d[0],
          (d[1] as (number | null)[])[i] ?? null,
        ]) as [number, number | null][];

        svg
          .append("path")
          .datum(seriesData)
          .attr("fill", "none")
          .attr("stroke", COLORS[i])
          .attr("stroke-width", 2)
          .attr("d", line);
      }
    }
  }, [data, chartType]);

  return (
    <div className="chart-container mb-8" ref={wrapperRef}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <svg ref={svgRef} className="w-full border rounded-md shadow-md" />
    </div>
  );
};

export default ChartRenderer;
