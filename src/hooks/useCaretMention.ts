import { useEffect, useState, RefObject } from "react";

interface CaretPosition {
  top: number;
  left: number;
}

interface MentionState {
  isVisible: boolean;
  query: string;
  position: CaretPosition;
}

interface UseCaretMentionReturn extends MentionState {
  handleKeyUp: (e: React.KeyboardEvent) => void;
  handleMentionSelect: (username: string) => void;
  reset: () => void;
}

export const useCaretMention = (
  editorRef: RefObject<HTMLDivElement>,
  onChange?: () => void
): UseCaretMentionReturn => {
  const [mentionState, setMentionState] = useState<MentionState>({
    isVisible: false,
    query: "",
    position: { top: 0, left: 0 },
  });

  const getCaretPosition = (): CaretPosition | null => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current?.getBoundingClientRect();

      if (editorRect) {
        return {
          top: rect.bottom - editorRect.top,
          left: rect.left - editorRect.left,
        };
      }
    }
    return null;
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    // If @ is typed, show the dropdown immediately
    if (e.key === "@") {
      const position = getCaretPosition();
      if (position) {
        setMentionState({
          isVisible: true,
          query: "",
          position,
        });
      }
      return;
    }

    // Skip shift key events as they're part of typing @
    if (e.key === "Shift") {
      return;
    }

    // For other keys, check if we're in a mention context
    const selection = window.getSelection();
    const content = editorRef.current?.textContent || "";
    const caretPos = selection?.anchorOffset || 0;

    // Find the last @ symbol before the caret
    const lastIndex = content.lastIndexOf("@", caretPos);

    if (lastIndex >= 0 && caretPos - lastIndex <= 20) {
      const query = content.slice(lastIndex + 1, caretPos);
      const position = getCaretPosition();

      if (position) {
        setMentionState({
          isVisible: true,
          query,
          position,
        });
      }
    } else if (!content.includes("@")) {
      // Only hide if there's no @ symbol in the content
      setMentionState((prev) => ({ ...prev, isVisible: false }));
    }

    onChange?.();
  };

  const handleMentionSelect = (username: string) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const content = editorRef.current.textContent || "";
    const caretPos = selection.anchorOffset;
    const lastAtPos = content.lastIndexOf("@", caretPos - 1);

    if (lastAtPos >= 0) {
      // Replace the @query with the selected username
      const before = content.slice(0, lastAtPos);
      const after = content.slice(caretPos);
      editorRef.current.textContent = `${before}@${username}${after}`;

      // Move caret to end of inserted mention
      const newPosition = lastAtPos + username.length + 1;
      const newRange = document.createRange();
      const textNode = editorRef.current.firstChild || editorRef.current;
      newRange.setStart(textNode, newPosition);
      newRange.setEnd(textNode, newPosition);
      selection.removeAllRanges();
      selection.addRange(newRange);

      // Reset mention state

      onChange?.();
    }
    reset();
  };

  const reset = () => {
    setMentionState({
      isVisible: false,
      query: "",
      position: { top: 0, left: 0 },
    });
  };

  // Add click handler to close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        reset();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return {
    ...mentionState,
    handleKeyUp,
    handleMentionSelect,
    reset,
  };
};
