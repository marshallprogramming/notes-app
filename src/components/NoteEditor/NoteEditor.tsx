import { FC, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useMentionsStore } from "../../hooks/useMentionsStore";
import { useCaretMention } from "../../hooks/useCaretMention";
import { MentionDropdown } from "../MentionDropdown";

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
    position: mentionPosition,
    handleKeyUp,
    handleMentionSelect,
  } = useCaretMention(editorRef, handleChange);

  // Debug log
  useEffect(() => {
    console.log("Mention state:", {
      showMentions,
      mentionQuery,
      mentionPosition,
    });
  }, [showMentions, mentionQuery, mentionPosition]);

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

  const handleEditorKeyUp = (e: React.KeyboardEvent) => {
    handleKeyUp(e);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 p-4">
        <input
          ref={titleRef}
          type="text"
          className="w-full text-xl font-semibold outline-none"
          placeholder="Note title..."
          defaultValue={initialTitle}
          onChange={handleChange}
          data-testid="note-title"
        />
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
          showMentions={showMentions}
          query={mentionQuery}
          position={mentionPosition}
          onSelect={handleMentionSelect}
        />
      </div>
    </div>
  );
};

export default NoteEditor;
