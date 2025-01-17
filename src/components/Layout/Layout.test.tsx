import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Layout from "./Layout";

const mockUseNotesStore = vi.fn();

vi.mock("../../services/notes", () => ({
  formatDate: () => "Jan 2025",
}));

vi.mock("../../hooks/useNotesStore", () => ({
  useNotesStore: () => mockUseNotesStore(),
}));

describe("Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should close editor and save content when clicking overlay", async () => {
    const mockUpdateNote = vi.fn();
    const mockSelectNote = vi.fn();
    const testNote = {
      id: "note-1",
      title: "Test Note",
      body: "Test Body",
      lastUpdated: "Jan 2025",
    };

    mockUseNotesStore.mockReturnValue({
      selectedNoteId: "note-1",
      notes: [testNote],
      updateNote: mockUpdateNote,
      fetchNotes: vi.fn(),
      selectNote: mockSelectNote,
    });

    render(<Layout />);

    const overlay = screen.getByTestId("editor-overlay");
    await fireEvent.click(overlay);

    expect(mockUpdateNote).toHaveBeenCalledWith({
      id: "note-1",
      title: "Test Note",
      body: "Test Body",
      lastUpdated: "Jan 2025",
    });
    expect(mockSelectNote).toHaveBeenCalledWith(null);
  });
});
