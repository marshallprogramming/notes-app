import React, { useEffect } from "react";
import { useNotesStore } from "../../hooks/useNotesStore";
import { BlankNoteCard, NoteCard } from "../NoteCard";

const NotesPage: React.FC = () => {
  const { notes, selectNote, fetchNotes, addNote } = useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNoteClick = (id: string) => {
    console.log(id);
    selectNote(id);
  };

  const handleAddNote = () => {
    const title = "New Note";
    addNote({
      title,
      body: `# ${title}\n\nStart writing here...`, // Using the title in the body content
    });
  };

  return (
    <div className="h-full p-6">
      <div className="border border-dashed border-gray-300 p-4 text-gray-500 text-center h-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid gap-6">
        {notes.map(({ id, title, body, lastUpdated }) => (
          <NoteCard
            key={id}
            title={title}
            body={body}
            lastUpdated={lastUpdated}
            onClick={() => handleNoteClick(id)}
          />
        ))}
        <BlankNoteCard onClick={handleAddNote} />
      </div>
    </div>
  );
};

export default NotesPage;
