import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NoteCard } from "..";
import { Note } from "../../../services/notes";

describe("NoteCard", () => {
  it("Should render body, title and lastUpdated", () => {
    const note: Note = {
      id: "1",
      title: "title",
      lastUpdated: "Dec 2025",
      body: "body",
    };
    render(<NoteCard {...note} onClick={() => {}} />);
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("Last update: Dec 2025")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("Should be clickable", () => {
    const handleClick = vi.fn();
    const note: Note = {
      id: "1",
      title: "title",
      lastUpdated: "Dec 2025",
      body: "body",
    };

    render(<NoteCard {...note} onClick={handleClick} />);

    const card = screen.getByText("title").closest("div");
    fireEvent.click(card!);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
