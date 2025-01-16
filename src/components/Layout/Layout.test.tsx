import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Layout from "./Layout";

const mockUseNotesStore = vi.fn();

vi.mock("../../hooks/useNotesStore", () => ({
  useNotesStore: () => mockUseNotesStore(),
}));

describe("Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should hide editor when no note is selected", () => {
    mockUseNotesStore.mockReturnValue({
      selectedNoteId: null,
      notes: [],
      updateNote: vi.fn(),
      fetchNotes: vi.fn(),
      selectNote: vi.fn(),
    });

    render(<Layout />);

    const editorPanel = screen.getByTestId("editor-panel");
    expect(editorPanel.className).toContain("translate-x-[150%]");
  });

  it("should show editor when note is selected", () => {
    mockUseNotesStore.mockReturnValue({
      selectedNoteId: "note-1",
      notes: [
        {
          id: "note-1",
          title: "Test Note",
          body: "Test Body",
          lastUpdated: "Jan 2025",
        },
      ],
      updateNote: vi.fn(),
      fetchNotes: vi.fn(),
      selectNote: vi.fn(),
    });

    render(<Layout />);

    const editorPanel = screen.getByTestId("editor-panel");
    expect(editorPanel.className).toContain("-translate-x-1/2");
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

  it("should update note content when editor content changes", async () => {
    const mockUpdateNote = vi.fn();
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
      selectNote: vi.fn(),
    });

    render(<Layout />);

    const editor = screen.getByTestId("note-editor");
    fireEvent.input(editor, {
      target: { innerHTML: "New content" },
    });

    expect(mockUpdateNote).toHaveBeenCalledWith({
      id: "note-1",
      title: "Test Note",
      body: "New content",
      lastUpdated: "Jan 2025",
    });
  });
});
