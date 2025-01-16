import { FC } from "react";
import Layout from "./components/Layout/Layout";

const App: FC = () => {
  return (
    <div className="min-h-screen bg-noteBackground">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto">
          <h2 className="px-4 py-4 text-xl font-semibold">Note Taking App</h2>
        </div>
      </header>
      <main className="container mx-auto h-[calc(100vh-4rem)]">
        <Layout />
      </main>
    </div>
  );
};

export default App;
