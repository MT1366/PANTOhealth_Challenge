import { useState, useEffect } from "react";
import ChartRenderer from "./ChartRenderer";
import type { ChartData } from "./types";

const ChartWrapper = () => {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) throw new Error("Failed to fetch data");

        const data: ChartData[] = await response.json();

        // Validate data structure
        const isValid = data.every(
          (chart) =>
            chart.title &&
            Array.isArray(chart.data) &&
            chart.data.every(
              (point) =>
                Array.isArray(point) &&
                point.length === 2 &&
                typeof point[0] === "number"
            )
        );

        if (!isValid) throw new Error("Invalid data structure");

        setCharts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading charts...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div>
      {charts.length > 0 ? (
        charts.map((chart, index) => (
          <ChartRenderer key={`chart-${index}`} {...chart} />
        ))
      ) : (
        <p>No chart data available</p>
      )}
    </div>
  );
};

export default ChartWrapper;
