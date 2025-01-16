import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  fetchNotesApi,
  createNoteApi,
  updateNoteApi,
  formatDate,
} from "../notes";

describe("notes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock Date to ensure consistent timestamps
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-25"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fetchNotesApi should return the array of notes on success", async () => {
    const mockNotes = [
      {
        id: "note-1",
        title: "Test Note",
        body: "Mock Note 1",
        lastUpdated: "Dec 2025",
      },
    ];

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

  it("createNoteApi should only send body in request but return full note", async () => {
    const input = {
      title: "Test Note",
      body: "Test Body",
    };

    // Mock UUID for consistent testing
    vi.mock("uuid", () => ({
      v4: () => "mock-uuid",
    }));

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
    } as Response);

    const result = await createNoteApi(input);

    // Check that only body was sent in request
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/notes"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: input.body }),
      })
    );

    // Check that full note was returned
    expect(result).toEqual({
      id: "mock-uuid",
      title: "Test Note",
      body: "Test Body",
      lastUpdated: "Dec 2025",
    });
  });

  it("updateNoteApi should send updated note and return full note", async () => {
    const input = {
      id: "note-123",
      title: "Updated Title",
      body: "Updated Body",
      lastUpdated: formatDate(new Date()),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
    } as Response);

    const result = await updateNoteApi(input);

    // Check that only body was sent in request
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/notes/note-123"),
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: input.id, body: JSON.stringify(input) }),
      })
    );

    // Check that full note was returned
    expect(result).toEqual({
      id: "note-123",
      title: "Updated Title",
      body: "Updated Body",
      lastUpdated: input.lastUpdated,
    });
  });

  it("createNoteApi should throw if response is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    await expect(
      createNoteApi({
        title: "Test",
        body: "Test",
      })
    ).rejects.toThrow("Failed to create note");
  });

  it("updateNoteApi should throw if response is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    await expect(
      updateNoteApi({
        id: "note-123",
        title: "Test",
        body: "Test",
        lastUpdated: formatDate(new Date()),
      })
    ).rejects.toThrow("Failed to update note");
  });
});
