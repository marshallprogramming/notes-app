import { FC } from "react";
import NotesPage from "./components/NotesPage";

const App: FC = () => {
  return (
    <div className="min-h-screen bg-noteBackground">
      <h2 className="mx-4 py-4">Note Taking App</h2>
      <div className="container mx-auto h-full">
        <NotesPage />
      </div>
    </div>
  );
};

export default App;
