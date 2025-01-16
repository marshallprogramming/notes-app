import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NoteEditor } from ".";

describe("NoteEditor", () => {
  it("should render with initial content", () => {
    const initialContent = "Test content";
    render(<NoteEditor initialContent={initialContent} onChange={() => {}} />);
    const editor = screen.getByTestId("note-editor");
    expect(editor.innerHTML).toBe(initialContent);
  });

  it("should render empty when no initial content provided", () => {
    render(<NoteEditor onChange={() => {}} />);

    const editor = screen.getByTestId("note-editor");
    expect(editor.innerHTML).toBe("");
  });

  it("should call onChange when content changes", () => {
    const handleChange = vi.fn();
    render(<NoteEditor onChange={handleChange} />);

    const editor = screen.getByTestId("note-editor");
    fireEvent.input(editor, {
      target: { innerHTML: "New content" },
    });

    expect(handleChange).toHaveBeenCalledWith("New content");
  });

  it("should show focus ring when focused", () => {
    render(<NoteEditor onChange={() => {}} />);

    const editor = screen.getByTestId("note-editor");
    expect(editor.className).toContain("ring-gray-200");

    fireEvent.focus(editor);
    expect(editor.className).toContain("ring-blue-500");

    fireEvent.blur(editor);
    expect(editor.className).toContain("ring-gray-200");
  });
});
