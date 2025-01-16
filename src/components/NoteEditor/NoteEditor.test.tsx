import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NoteEditor } from ".";

describe("NoteEditor", () => {
  const mockOnChange = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should render with initial content", () => {
    const initialContent = "Test content";
    render(
      <NoteEditor
        initialContent={initialContent}
        onChange={mockOnChange}
        onSave={mockOnSave}
      />
    );

    const editor = screen.getByTestId("note-editor");
    expect(editor.innerHTML).toBe(initialContent);
  });

  it("should call onChange immediately when content changes", () => {
    const handleChange = vi.fn();
    render(<NoteEditor onChange={handleChange} onSave={mockOnSave} />);

    const editor = screen.getByTestId("note-editor");
    fireEvent.input(editor, {
      target: { innerHTML: "New content" },
    });

    expect(handleChange).toHaveBeenCalledWith("New content");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should debounce onSave calls", async () => {
    const handleSave = vi.fn();
    render(<NoteEditor onChange={mockOnChange} onSave={handleSave} />);

    const editor = screen.getByTestId("note-editor");

    // First input
    fireEvent.input(editor, {
      target: { innerHTML: "First" },
    });

    // Quick second input
    fireEvent.input(editor, {
      target: { innerHTML: "Second" },
    });

    // Third input before debounce timer expires
    fireEvent.input(editor, {
      target: { innerHTML: "Final content" },
    });

    // Verify no immediate save
    expect(handleSave).not.toHaveBeenCalled();

    // Fast-forward timers
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Verify only saved once with final content
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith("Final content");
  });

  it("should show focus styles when focused", () => {
    render(<NoteEditor onChange={mockOnChange} onSave={mockOnSave} />);

    const editor = screen.getByTestId("note-editor");
    expect(editor.className).toContain("ring-gray-200");

    fireEvent.focus(editor);
    expect(editor.className).toContain("ring-blue-500");

    fireEvent.blur(editor);
    expect(editor.className).toContain("ring-gray-200");
  });

  it("should cleanup debounced save on unmount", () => {
    const handleSave = vi.fn();
    const { unmount } = render(
      <NoteEditor onChange={mockOnChange} onSave={handleSave} />
    );

    const editor = screen.getByTestId("note-editor");
    fireEvent.input(editor, {
      target: { innerHTML: "New content" },
    });

    unmount();

    vi.advanceTimersByTime(1000);

    expect(handleSave).not.toHaveBeenCalled();
  });
});
