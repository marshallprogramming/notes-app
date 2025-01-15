import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchNotesApi, createNoteApi, updateNoteApi } from "../notes";

describe("notes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchNotesApi should return the array of notes on success", async () => {
    const mockNotes = [{ id: 1, body: "Mock Note 1" }];
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockNotes,
    } as Response);

    const notes = await fetchNotesApi();
    expect(notes).toEqual(mockNotes);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/notes")
    );
  });

  it("fetchNotesApi should throw if response is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as Response);

    await expect(fetchNotesApi()).rejects.toThrow("Failed to fetch notes");
  });

  it("createNoteApi should POST and return new note on success", async () => {
    const mockNote = { id: 2, body: "Created via test" };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockNote,
    } as Response);

    const result = await createNoteApi("Created via test");
    expect(result).toEqual(mockNote);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/notes"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ body: "Created via test" }),
      })
    );
  });

  it("updateNoteApi should PUT and not return anything on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
    } as Response);

    await updateNoteApi(123, "New Body");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/notes/123"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ body: "New Body" }),
      })
    );
  });
});
