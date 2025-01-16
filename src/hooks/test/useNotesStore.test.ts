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
      { id: 1, body: "Hello", title: "Title", lastUpdated: "Dec 2025" },
    ];
    vi.spyOn(notesService, "fetchNotesApi").mockResolvedValueOnce(mockData);

    await useNotesStore.getState().fetchNotes();
    const { notes } = useNotesStore.getState();
    expect(notes).toEqual(mockData);
  });

  it("addNote should call createNoteApi and update the store", async () => {
    const createdNote = {
      id: 2,
      body: "Newly created note",
      title: "Title",
      lastUpdated: "Dec 2025",
    };
    vi.spyOn(notesService, "createNoteApi").mockResolvedValueOnce(createdNote);

    await useNotesStore.getState().addNote("Newly created note");
    const { notes } = useNotesStore.getState();

    expect(notesService.createNoteApi).toHaveBeenCalledWith(
      "Newly created note"
    );
    expect(notes.length).toBe(1);
    expect(notes[0]).toEqual(createdNote);
  });

  it("updateNoteBody should call updateNoteApi and modify the local note", async () => {
    useNotesStore.setState({
      notes: [
        { id: 10, body: "Old body", title: "Title", lastUpdated: "Dec 2025" },
      ],
    });

    vi.spyOn(notesService, "updateNoteApi").mockResolvedValueOnce(undefined);

    await useNotesStore.getState().updateNoteBody(10, "Updated body");
    const { notes } = useNotesStore.getState();

    expect(notesService.updateNoteApi).toHaveBeenCalledWith(10, "Updated body");
    expect(notes[0].body).toBe("Updated body");
  });
});
