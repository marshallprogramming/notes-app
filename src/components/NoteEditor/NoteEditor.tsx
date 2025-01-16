import { FC, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

interface NoteEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  onSave: (content: string) => void;
}

const SAVE_DELAY = 1000;

const NoteEditor: FC<NoteEditorProps> = ({
  initialContent = "",
  onChange,
  onSave,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSave = useRef(
    debounce((content: string) => {
      onSave(content);
    }, SAVE_DELAY)
  ).current;

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const handleInput = () => {
    const content = editorRef.current?.innerHTML || "";
    onChange(content);
    debouncedSave(content);
  };

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return (
    <div
      ref={editorRef}
      contentEditable
      className={`w-full h-full p-4 bg-white rounded-sm ${
        isFocused ? "ring-2 ring-blue-500" : "ring-1 ring-gray-200"
      }`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onInput={handleInput}
      data-testid="note-editor"
    />
  );
};

export default NoteEditor;
