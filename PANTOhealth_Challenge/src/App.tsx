import ChartWrapper from "./components/ChartWrapper";

function App() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold">D3.js Chart Dashboard</h1>
        <p className="text-gray-600">
          Dynamic visualization of time-series data
        </p>
      </header>

      <ChartWrapper />
    </div>
  );
}

export default App;
