import { FC, useCallback, useRef, useEffect } from "react";
import { useNotesStore } from "../../hooks/useNotesStore";
import { NoteEditor } from "../NoteEditor";
import { NotesPage } from "../NotesPage";
import { formatDate } from "../../services/notes";

const Layout: FC = () => {
  const { selectedNoteId, notes, updateNote, selectNote } = useNotesStore();
  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const currentTitle = useRef<string>(selectedNote?.title || "");
  const currentBody = useRef<string>(selectedNote?.body || "");

  useEffect(() => {
    currentTitle.current = selectedNote?.title || "";
    currentBody.current = selectedNote?.body || "";
  }, [selectedNote]);

  const handleClose = useCallback(async () => {
    if (selectedNoteId !== null && selectedNote) {
      await updateNote({
        id: selectedNoteId,
        title: currentTitle.current,
        body: currentBody.current,
        lastUpdated: formatDate(new Date()),
      });
      selectNote(null);
    }
  }, [selectedNoteId, selectedNote, updateNote, selectNote]);

  const handleChange = useCallback(
    ({ title, body }: { title: string; body: string }) => {
      currentTitle.current = title;
      currentBody.current = body;
    },
    []
  );

  const handleSave = useCallback(
    ({ title, body }: { title: string; body: string }) => {
      if (selectedNoteId !== null && selectedNote) {
        updateNote({
          id: selectedNoteId,
          title,
          body,
          lastUpdated: formatDate(new Date()),
        });
      }
    },
    [selectedNoteId, selectedNote, updateNote]
  );

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
        className={`overflow-auto fixed top-1/2 left-1/2 w-[calc(min(80vh*0.707,90vw))] aspect-[1/1.4142] 
          -translate-y-1/2 bg-white shadow-xl transform transition-all 
          duration-300 ease-in-out ${
            selectedNoteId !== null
              ? "-translate-x-1/2 opacity-100"
              : "translate-x-[150%] opacity-0 pointer-events-none"
          }`}
      >
        {selectedNoteId !== null && (
          <NoteEditor
            initialTitle={selectedNote?.title}
            initialContent={selectedNote?.body}
            onChange={handleChange}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
