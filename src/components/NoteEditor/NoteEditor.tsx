import { FC, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useMentionsStore } from "../../hooks/useMentionsStore";
import { useCaretMention } from "../../hooks/useCaretMention";
import MentionDropdown, {
  MentionDropdownRef,
} from "../MentionDropdown/MentionDropdown";
import CloseIcon from "../icons/CloseIcon";
import { useNotesStore } from "../../hooks/useNotesStore";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onChange: (data: { title: string; body: string }) => void;
  onSave: (data: { title: string; body: string }) => void;
}

const SAVE_DELAY = 1000;

const NoteEditor: FC<NoteEditorProps> = ({
  initialTitle = "",
  initialContent = "",
  onChange,
  onSave,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const { selectNote } = useNotesStore();

  // Ref to the mention dropdown for measuring
  const mentionDropdownRef = useRef<MentionDropdownRef>(null);

  const [isFocused, setIsFocused] = useState(false);
  const fetchUsers = useMentionsStore((s) => s.fetchUsers);

  const debouncedSave = useRef(
    debounce((data: { title: string; body: string }) => {
      onSave(data);
    }, SAVE_DELAY)
  ).current;

  const handleChange = () => {
    const content = editorRef.current?.innerHTML || "";
    const title = titleRef.current?.value || "";
    const data = { title, body: content };

    onChange(data);
    debouncedSave(data);
  };

  const {
    isVisible: showMentions,
    query: mentionQuery,
    position: rawMentionPosition,
    handleKeyUp,
    handleMentionSelect,
  } = useCaretMention(editorRef, handleChange);

  // We'll store a "clamped" position to actually use for the dropdown
  const [clampedPosition, setClampedPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    console.log("Mention state:", {
      showMentions,
      mentionQuery,
      mentionPosition: rawMentionPosition,
    });
  }, [showMentions, mentionQuery, rawMentionPosition]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!isFocused && editorRef.current) {
      const currentHTML = editorRef.current.innerHTML;
      if (currentHTML !== initialContent) {
        editorRef.current.innerHTML = initialContent;
      }
    }
  }, [initialContent, isFocused]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Each time the mention is visible or the raw position changes,
  // measure and clamp. We do this in a microtask so the dropdown
  // has time to render if needed, or at least measure its current size.
  useEffect(() => {
    if (showMentions && editorRef.current) {
      const editorRect = editorRef.current.getBoundingClientRect();

      requestAnimationFrame(() => {
        const dropdownSize = mentionDropdownRef.current?.measure() ?? {
          width: 200,
          height: 0,
        };

        const maxLeft = editorRect.width - dropdownSize.width;
        const maxTop = editorRect.height - dropdownSize.height;

        let nextLeft = rawMentionPosition.left;
        let nextTop = rawMentionPosition.top;

        if (nextLeft < 0) nextLeft = 0;
        if (nextLeft > maxLeft) nextLeft = maxLeft;

        if (nextTop < 0) nextTop = 0;
        if (nextTop > maxTop) nextTop = maxTop;

        setClampedPosition({ top: nextTop, left: nextLeft });
      });
    }
  }, [showMentions, rawMentionPosition]);

  const handleEditorKeyUp = (e: React.KeyboardEvent) => {
    handleKeyUp(e);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 p-4 flex justify-between">
        <input
          ref={titleRef}
          type="text"
          className="w-full text-xl font-semibold outline-none"
          placeholder="Note title..."
          defaultValue={initialTitle}
          onChange={handleChange}
          data-testid="note-title"
        />
        <div
          onClick={() => selectNote(null)}
          className="cursor-pointer opacity-80 transition-opacity duration-300 ease-in-out hover:opacity-100"
        >
          <CloseIcon />
        </div>
      </div>
      <div className="flex-1 relative">
        <div
          ref={editorRef}
          contentEditable
          className={`h-full p-4 outline-none ${
            isFocused ? "ring-2 ring-inset ring-blue-500" : ""
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onInput={handleChange}
          onKeyUp={handleEditorKeyUp}
          data-testid="note-editor"
        />
        <MentionDropdown
          ref={mentionDropdownRef}
          showMentions={showMentions}
          query={mentionQuery}
          position={clampedPosition}
          onSelect={handleMentionSelect}
        />
      </div>
    </div>
  );
};

export default NoteEditor;
