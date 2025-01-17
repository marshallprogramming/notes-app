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

  const getAbsoluteCaretPos = (): number => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current) {
      return 0;
    }
    const range = sel.getRangeAt(0).cloneRange();

    const tempRange = document.createRange();
    tempRange.selectNodeContents(editorRef.current);
    tempRange.setEnd(range.endContainer, range.endOffset);

    return tempRange.toString().length;
  };

  const getCaretPosition = (): CaretPosition | null => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
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

  const reset = () => {
    setMentionState({
      isVisible: false,
      query: "",
      position: { top: 0, left: 0 },
    });
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    const content = editorRef.current?.textContent || "";

    if (e.key === " " && mentionState.isVisible) {
      reset();
      onChange?.();
      return;
    }

    if (e.key === "@") {
      const position = getCaretPosition();
      if (position) {
        setMentionState({
          isVisible: true,
          query: "",
          position,
        });
      }
      onChange?.();
      return;
    }

    if (e.key === "Shift") {
      onChange?.();
      return;
    }

    const caretPos = getAbsoluteCaretPos();

    const lastIndex = content.lastIndexOf("@", caretPos - 1);
    if (lastIndex >= 0) {
      const mentionLength = caretPos - (lastIndex + 1);

      if (mentionLength >= 0 && mentionLength <= 30) {
        const query = content.slice(lastIndex + 1, caretPos);
        const position = getCaretPosition();

        if (position) {
          setMentionState({
            isVisible: true,
            query,
            position,
          });
        }
      } else {
        reset();
      }
    } else {
      reset();
    }

    onChange?.();
  };

  const handleMentionSelect = (username: string) => {
    if (!editorRef.current) return;

    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const content = editorRef.current.textContent || "";
    const caretPos = getAbsoluteCaretPos();
    const lastAtPos = content.lastIndexOf("@", caretPos - 1);

    if (lastAtPos >= 0) {
      const before = content.slice(0, lastAtPos);
      const after = content.slice(caretPos);
      editorRef.current.textContent = `${before}@${username}${after}`;

      const newPosition = lastAtPos + username.length + 1;
      const newRange = document.createRange();
      const textNode = editorRef.current.firstChild;
      if (textNode) {
        newRange.setStart(textNode, newPosition);
        newRange.setEnd(textNode, newPosition);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }

      onChange?.();
    }

    reset();
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        reset();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [editorRef]);

  return {
    ...mentionState,
    handleKeyUp,
    handleMentionSelect,
    reset,
  };
};
