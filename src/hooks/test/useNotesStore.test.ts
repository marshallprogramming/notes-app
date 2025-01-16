import { describe, it, expect, beforeEach, vi } from "vitest";
import { useNotesStore } from "../useNotesStore";
import * as notesService from "../../services/notes";

describe("useNotesStore with services", () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: [], selectedNoteId: null });
    vi.restoreAllMocks();
  });

  it("fetchNotes should populate store with data from service", async () => {
    const mockData = [
      { id: "note-1", title: "Title", body: "Hello", lastUpdated: "Dec 2025" },
    ];
    vi.spyOn(notesService, "fetchNotesApi").mockResolvedValueOnce(mockData);

    await useNotesStore.getState().fetchNotes();
    const { notes } = useNotesStore.getState();
    expect(notes).toEqual(mockData);
  });

  it("addNote should call createNoteApi and update the store", async () => {
    const noteInput = {
      title: "New Note",
      body: "Newly created note",
    };

    const createdNote = {
      id: "note-2",
      title: "New Note",
      body: "Newly created note",
      lastUpdated: "Dec 2025",
    };

    vi.spyOn(notesService, "createNoteApi").mockResolvedValueOnce(createdNote);

    await useNotesStore.getState().addNote(noteInput);
    const { notes, selectedNoteId } = useNotesStore.getState();

    expect(notesService.createNoteApi).toHaveBeenCalledWith(noteInput);
    expect(notes.length).toBe(1);
    expect(notes[0]).toEqual(createdNote);
    expect(selectedNoteId).toBe(createdNote.id);
  });

  it("updateNote should call updateNoteApi and modify the local note", async () => {
    const initialNote = {
      id: "note-10",
      title: "Title",
      body: "Old body",
      lastUpdated: "Dec 2025",
    };

    useNotesStore.setState({ notes: [initialNote] });

    const updateInput = {
      id: "note-10",
      title: "Updated Title",
      body: "Updated body",
    };

    const updatedNote = {
      ...updateInput,
      lastUpdated: "Dec 2025",
    };

    vi.spyOn(notesService, "updateNoteApi").mockResolvedValueOnce(updatedNote);

    await useNotesStore.getState().updateNote(updateInput);
    const { notes } = useNotesStore.getState();

    expect(notesService.updateNoteApi).toHaveBeenCalledWith(updateInput);
    expect(notes[0]).toEqual(updatedNote);
  });

  it("selectNote should update selectedNoteId", () => {
    const store = useNotesStore.getState();
    store.selectNote("note-1");
    expect(useNotesStore.getState().selectedNoteId).toBe("note-1");

    store.selectNote(null);
    expect(useNotesStore.getState().selectedNoteId).toBeNull();
  });
});
