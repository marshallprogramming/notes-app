import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NotesPage from "./NotesPage";

const mockStore = {
  notes: [
    { id: 1, title: "Test Note", body: "Test Body", lastUpdated: "2025" },
    { id: 2, title: "Test Note 2", body: "Test Body 2", lastUpdated: "2025" },
  ],
  selectNote: vi.fn(),
  fetchNotes: vi.fn(),
  addNote: vi.fn(),
};

vi.mock("../../hooks/useNotesStore", () => ({
  useNotesStore: () => mockStore,
}));

describe("NotesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch notes on mount", () => {
    render(<NotesPage />);

    expect(mockStore.fetchNotes).toHaveBeenCalledTimes(1);
  });

  it("should render all notes from store", () => {
    render(<NotesPage />);
    const noteElements = screen.getAllByText(/Test Note/);
    expect(noteElements).toHaveLength(2);
  });

  it("should call selectNote when a note is clicked", () => {
    render(<NotesPage />);
    const firstNote = screen.getByText("Test Note").closest("div");
    fireEvent.click(firstNote!);
    expect(mockStore.selectNote).toHaveBeenCalledWith(1);
  });

  it("should call addNote when blank card is clicked", () => {
    render(<NotesPage />);
    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);
    expect(mockStore.addNote).toHaveBeenCalledWith("New note");
  });
});
