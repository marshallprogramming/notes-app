import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BlankNoteCard } from "..";

describe("BlankNoteCard", () => {
  it("Should be clickable", () => {
    const handleClick = vi.fn();

    render(<BlankNoteCard onClick={handleClick} />);

    const card = screen.getByRole("button");
    fireEvent.click(card!);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
