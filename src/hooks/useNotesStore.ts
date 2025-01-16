import { create } from "zustand";
import {
  fetchNotesApi,
  createNoteApi,
  updateNoteApi,
  Note as ApiNote,
  Note,
} from "../services/notes";

interface NotesState {
  notes: ReadonlyArray<Note>;
  selectedNoteId: number | null;

  selectNote: (id: number | null) => void;

  fetchNotes: () => Promise<void>;
  addNote: (body: string) => Promise<void>;
  updateNoteBody: (id: number, newBody: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  selectedNoteId: null,

  selectNote: (selectedNoteId) => set({ selectedNoteId }),

  fetchNotes: async () => {
    try {
      const data: ReadonlyArray<ApiNote> = await fetchNotesApi();
      set({ notes: data });
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  },

  addNote: async (body) => {
    try {
      const newNote = await createNoteApi(body);
      set((state) => ({
        notes: [...state.notes, newNote],
      }));
    } catch (error) {
      console.error("Error creating note:", error);
    }
  },

  updateNoteBody: async (id, newBody) => {
    try {
      await updateNoteApi(id, newBody);
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, body: newBody } : note
        ),
      }));
    } catch (error) {
      console.error("Error updating note:", error);
    }
  },
}));
