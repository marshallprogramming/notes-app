import { FC } from "react";
import Layout from "./components/Layout/Layout";
import { useNotesStore } from "./hooks/useNotesStore";

const App: FC = () => {
  const { clearAll } = useNotesStore();
  return (
    <div className="min-h-screen bg-noteBackground">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="px-4 py-4 text-xl font-semibold">Note Taking App</h2>
          <button
            className="mx-2 rounded bg-blue-300 h-min py-2 px-4 opacity-80 text-white transition-opacity duration-300 ease-in-out hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => clearAll()}
          >
            Reset Notes
          </button>
        </div>
      </header>
      <main className="container mx-auto h-[calc(100vh-4rem)]">
        <Layout />
      </main>
    </div>
  );
};

export default App;
