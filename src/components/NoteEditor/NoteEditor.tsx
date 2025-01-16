import { FC, useEffect, useRef, useState } from "react";

interface NoteEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
}

const NoteEditor: FC<NoteEditorProps> = ({ initialContent = "", onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const handleInput = () => {
    const content = editorRef.current?.innerHTML || "";
    onChange(content);
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      className={`w-full h-full p-4 bg-white rounded-sm ${
        isFocused ? "ring-2 ring-blue-500" : "ring-1 ring-gray-200"
      } `}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onInput={handleInput}
      data-testid="note-editor"
    />
  );
};

export default NoteEditor;
