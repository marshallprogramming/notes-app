import React from "react";
import { Note } from "../services/notes";
import { NoteCard, BlankNoteCard } from "./NoteCard";

const NotesPage: React.FC = () => {
  const dummyNotes: ReadonlyArray<Note> = [
    { id: 1, title: "title", body: "dummy text", lastUpdated: "Dec 2025" },
    { id: 2, title: "title", body: "dummy text 2", lastUpdated: "Dec 2025" },
    { id: 3, title: "title", body: "dummy text 3", lastUpdated: "Dec 2025" },
    { id: 4, title: "title", body: "dummy text 4", lastUpdated: "Dec 2025" },
  ];

  const handleNoteClick = (id: number) => {
    console.log(id);
  };

  return (
    <div className="h-full p-6">
      <div className="border border-dashed border-gray-300 p-4 text-gray-500 text-center h-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid gap-6">
        {dummyNotes.map(({ id, title, body, lastUpdated }) => (
          <NoteCard
            title={title}
            body={body}
            lastUpdated={lastUpdated}
            onClick={() => handleNoteClick(id)}
          />
        ))}
        <BlankNoteCard onClick={() => console.log("adding new")} />
      </div>
    </div>
  );
};

export default NotesPage;
