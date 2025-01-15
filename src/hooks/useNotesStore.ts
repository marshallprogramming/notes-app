import { create } from "zustand";

export interface Note {
  id: number;
  body: string;
}

interface NotesState {
  notes: ReadonlyArray<Note>;
  selectedNoteId: number | null;
  selectNote: (id: number | null) => void;
  addNote: (newNote: Note) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  selectedNoteId: null,

  selectNote: (selectedNoteId) => {
    set(() => ({ selectedNoteId }));
  },
  addNote: (newNote) => {
    set((state) => ({
      notes: [...state.notes, newNote],
    }));
  },
}));
