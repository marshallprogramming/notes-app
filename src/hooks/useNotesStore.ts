import { create } from "zustand";
import {
  fetchNotesApi,
  createNoteApi,
  updateNoteApi,
  Note,
  CreateNoteInput,
  UpdateNoteInput,
} from "../services/notes";
import { clearSessionId, getOrCreateSessionId } from "../services/session";

interface NotesState {
  notes: ReadonlyArray<Note>;
  selectedNoteId: string | null;

  selectNote: (id: string | null) => void;
  fetchNotes: () => Promise<void>;
  addNote: (input: CreateNoteInput) => Promise<void>;
  updateNote: (input: UpdateNoteInput) => Promise<void>;
  clearAll: () => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  selectedNoteId: null,

  selectNote: (selectedNoteId) => set({ selectedNoteId }),

  fetchNotes: async () => {
    try {
      const data = await fetchNotesApi();
      set({
        notes: data.map((note) => ({ id: note.id, ...JSON.parse(note.body) })),
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  },

  addNote: async (input) => {
    try {
      const newNote = await createNoteApi(input);
      set((state) => ({
        notes: [...state.notes, newNote],
        selectedNoteId: newNote.id,
      }));
    } catch (error) {
      console.error("Error creating note:", error);
    }
  },

  updateNote: async (input) => {
    try {
      const updatedNote = await updateNoteApi(input);
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === input.id ? updatedNote : note
        ),
      }));
    } catch (error) {
      console.error("Error updating note:", error);
    }
  },

  clearAll: () => {
    clearSessionId();
    getOrCreateSessionId();
    set(() => ({ notes: [], selectedNoteId: null }));
  },
}));
