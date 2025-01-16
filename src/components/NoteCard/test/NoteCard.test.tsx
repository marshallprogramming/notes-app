import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NoteCard } from "..";

describe("NoteCard", () => {
  it("Should render plain text from HTML content", () => {
    const note = {
      title: "title",
      lastUpdated: "Dec 2025",
      body: "<div>Hello </div><div>World</div>",
    };

    render(<NoteCard {...note} onClick={() => {}} />);

    const content = screen.getByText(/Hello\s+World/);
    expect(content).toBeInTheDocument();
  });

  it("Should be clickable", () => {
    const handleClick = vi.fn();
    const note = {
      title: "title",
      lastUpdated: "Dec 2025",
      body: "body",
    };

    render(<NoteCard {...note} onClick={handleClick} />);

    const card = screen.getByText("title").closest("div");
    fireEvent.click(card!);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("Should strip HTML tags but preserve text content", () => {
    const note = {
      title: "title",
      lastUpdated: "Dec 2025",
      body: "<p>First paragraph</p>",
    };

    render(<NoteCard {...note} onClick={() => {}} />);

    expect(screen.getByText(/First paragraph/)).toBeInTheDocument();
  });
});
