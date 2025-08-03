import { useChartData } from "../hooks/useChartData";
import ChartRenderer from "./ChartRenderer";

const ChartWrapper = () => {
  const { data: chartsData, isLoading, isError } = useChartData();

  if (isLoading)
    return <div className="text-center py-8">Loading charts...</div>;
  if (isError) return <div className="text-red-500 p-4">Error: {isError}</div>;

  return (
    <div>
      {chartsData.length > 0 ? (
        chartsData.map((chart, index) => (
          <ChartRenderer key={`chart-${index}`} {...chart} />
        ))
      ) : (
        <p>No chart data available</p>
      )}
    </div>
  );
};

export default ChartWrapper;
