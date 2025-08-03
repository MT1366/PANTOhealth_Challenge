export type DataPoint = [number, number | null] | [number, (number | null)[]];
export type ChartData = {
  title: string;
  data: DataPoint[];
};

export type ChartType = "single" | "multi";

export const isMultiSeries = (data: DataPoint[]): boolean => {
  return data.some((point) => Array.isArray(point[1]));
};

export const isSingleSeries = (data: DataPoint[]): boolean => {
  return data.some((point) => typeof point[1] === "number");
};
