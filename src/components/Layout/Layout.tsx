import { FC, useCallback, useRef } from "react";
import { useNotesStore } from "../../hooks/useNotesStore";
import { NoteEditor } from "../NoteEditor";
import { NotesPage } from "../NotesPage";

const Layout: FC = () => {
  const { selectedNoteId, notes, updateNote, selectNote } = useNotesStore();
  const selectedNote = notes.find((note) => note.id === selectedNoteId);
  const currentContent = useRef<string>(selectedNote?.body || "");

  const handleClose = useCallback(async () => {
    if (selectedNoteId && selectedNote) {
      await updateNote({
        id: selectedNoteId,
        title: selectedNote.title,
        body: currentContent.current,
      });
      selectNote(null);
    }
  }, [selectedNoteId, selectedNote, updateNote, selectNote]);

  const handleChange = (content: string) => {
    currentContent.current = content;
  };

  const handleSave = (content: string) => {
    if (selectedNoteId && selectedNote) {
      updateNote({
        id: selectedNoteId,
        title: selectedNote.title,
        body: content,
      });
    }
  };

  return (
    <div className="relative h-full overflow-hidden">
      <div data-testid="notes-grid" className="w-full">
        <NotesPage />
      </div>

      <div
        data-testid="editor-overlay"
        onClick={handleClose}
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
            : "translate-x-[150%] opacity-0 pointer-events-none"
        }`}
      >
        <NoteEditor
          initialContent={selectedNote?.body}
          onChange={handleChange}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default Layout;
