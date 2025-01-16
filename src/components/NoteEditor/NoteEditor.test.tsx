import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NoteEditor } from ".";

describe("NoteEditor", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render with initial title and content", () => {
    render(
      <NoteEditor
        initialTitle="Test Title"
        initialContent="Test Content"
        onChange={() => {}}
        onSave={() => {}}
      />
    );

    const titleInput = screen.getByTestId("note-title") as HTMLInputElement;
    const editor = screen.getByTestId("note-editor");

    expect(titleInput.value).toBe("Test Title");
    expect(editor.innerHTML).toBe("Test Content");
  });

  it("should call onChange immediately when content changes", () => {
    const handleChange = vi.fn();
    render(<NoteEditor onChange={handleChange} onSave={() => {}} />);

    const editor = screen.getByTestId("note-editor");
    fireEvent.input(editor, {
      target: { innerHTML: "New content" },
    });

    expect(handleChange).toHaveBeenCalledWith({
      title: "",
      body: "New content",
    });
  });

  it("should call onChange immediately when title changes", () => {
    const handleChange = vi.fn();
    render(<NoteEditor onChange={handleChange} onSave={() => {}} />);

    const titleInput = screen.getByTestId("note-title");
    fireEvent.change(titleInput, {
      target: { value: "New Title" },
    });

    expect(handleChange).toHaveBeenCalledWith({
      title: "New Title",
      body: "",
    });
  });

  it("should debounce onSave calls", async () => {
    const handleSave = vi.fn();
    render(<NoteEditor onChange={() => {}} onSave={handleSave} />);

    const editor = screen.getByTestId("note-editor");
    const titleInput = screen.getByTestId("note-title");

    // Multiple rapid changes
    fireEvent.change(titleInput, { target: { value: "Title 1" } });
    fireEvent.input(editor, { target: { innerHTML: "Content 1" } });
    fireEvent.change(titleInput, { target: { value: "Title 2" } });
    fireEvent.input(editor, { target: { innerHTML: "Content 2" } });

    // Verify no immediate save
    expect(handleSave).not.toHaveBeenCalled();

    // Fast-forward timers
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Verify only saved once with final values
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith({
      title: "Title 2",
      body: "Content 2",
    });
  });
});
