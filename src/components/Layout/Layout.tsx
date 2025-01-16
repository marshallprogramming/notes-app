import { FC } from "react";
import { useNotesStore } from "../../hooks/useNotesStore";
import NotesPage from "../NotesPage";
import { NoteEditor } from "../NoteEditor";

const Layout: FC = () => {
  const { selectedNoteId } = useNotesStore();

  return (
    <div className="relative h-full overflow-hidden">
      <div data-testid="notes-grid" className="w-full">
        <NotesPage />
      </div>

      <div
        className={`fixed inset-0 bg-black/20 transition-opacity duration-300 ${
          selectedNoteId !== null
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        data-testid="editor-panel"
        className={`fixed top-1/2 left-1/2 w-[calc(min(80vh*0.707,90vw))] aspect-[1/1.4142] -translate-y-1/2 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          selectedNoteId !== null
            ? "-translate-x-1/2 opacity-100"
            : "opacity-0 translate-x-[150%] pointer-events-none"
        }`}
      >
        <NoteEditor onChange={() => {}} onSave={() => {}} />
      </div>
    </div>
  );
};

export default Layout;
