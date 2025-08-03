import { useState, useEffect } from "react";
import type { ChartDataType } from "../types/types";

export const useChartData = () => {
  const [data, setData] = useState<ChartDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) throw new Error("Failed to fetch data");

        const data: ChartDataType[] = await response.json();

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

        setData(data);
      } catch (err) {
        setIsError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, isError };
};
