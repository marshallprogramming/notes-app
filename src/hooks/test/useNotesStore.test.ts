import { describe, it, expect, beforeEach } from "vitest";
import { useNotesStore } from "../useNotesStore";

describe("useNotesStore", () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: [], selectedNoteId: null });
  });

  it("should initialise with empty notes array and null selectedNoteId", () => {
    const { notes, selectedNoteId } = useNotesStore.getState();

    expect(notes).toEqual([]);
    expect(selectedNoteId).toBeNull();
  });

  it("Should select a note", () => {
    const { selectNote } = useNotesStore.getState();
    selectNote(123);

    const { selectedNoteId } = useNotesStore.getState();
    expect(selectedNoteId).toBe(123);
  });

  it("should add a new note", () => {
    const { addNote } = useNotesStore.getState();
    addNote({ id: 1, body: "New note" });

    const { notes } = useNotesStore.getState();
    expect(notes.length).toBe(1);
    expect(notes[0].body).toBe("New note");
  });
});
