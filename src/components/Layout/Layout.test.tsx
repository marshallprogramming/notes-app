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
      updateNoteBody: vi.fn(),
      fetchNotes: vi.fn(),
      selectNote: vi.fn(),
    });

    render(<Layout />);

    const editorPanel = screen.getByTestId("editor-panel");
    expect(editorPanel.className).toContain("translate-x-[150%]");
  });

  it("should show editor when note is selected", () => {
    mockUseNotesStore.mockReturnValue({
      selectedNoteId: 1,
      notes: [
        { id: 1, title: "Test Note", body: "Test Body", lastUpdated: "2025" },
      ],
      updateNoteBody: vi.fn(),
      fetchNotes: vi.fn(),
      selectNote: vi.fn(),
    });

    render(<Layout />);

    const editorPanel = screen.getByTestId("editor-panel");
    expect(editorPanel.className).toContain("-translate-x-1/2");
  });

  it("should close editor and save content when clicking overlay", async () => {
    const mockUpdateNoteBody = vi.fn();
    const mockSelectNote = vi.fn();

    mockUseNotesStore.mockReturnValue({
      selectedNoteId: 1,
      notes: [
        { id: 1, title: "Test Note", body: "Test Body", lastUpdated: "2025" },
      ],
      updateNoteBody: mockUpdateNoteBody,
      fetchNotes: vi.fn(),
      selectNote: mockSelectNote,
    });

    render(<Layout />);

    const overlay = screen.getByTestId("editor-overlay");
    await fireEvent.click(overlay);

    expect(mockUpdateNoteBody).toHaveBeenCalledWith(1, "Test Body");
    expect(mockSelectNote).toHaveBeenCalledWith(null);
  });
});
