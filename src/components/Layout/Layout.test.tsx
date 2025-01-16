import { render, screen } from "@testing-library/react";
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
    });

    render(<Layout />);

    const editorPanel = screen.getByTestId("editor-panel");
    expect(editorPanel.className).toContain("-translate-x-1/2");
  });
});
