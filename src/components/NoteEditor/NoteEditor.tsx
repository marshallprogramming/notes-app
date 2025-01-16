import { FC, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

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

  const debouncedSave = useRef(
    debounce((data: { title: string; body: string }) => {
      onSave(data);
    }, SAVE_DELAY)
  ).current;

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
    if (titleRef.current) {
      titleRef.current.value = initialTitle;
    }
  }, [initialContent, initialTitle]);

  const handleChange = () => {
    const content = editorRef.current?.innerHTML || "";
    const title = titleRef.current?.value || "";
    const data = { title, body: content };

    onChange(data);
    debouncedSave(data);
  };

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

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
      <div
        ref={editorRef}
        contentEditable
        className={`flex-1 p-4 outline-none ${
          isFocused ? "ring-2 ring-inset ring-blue-500" : ""
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={handleChange}
        data-testid="note-editor"
      />
    </div>
  );
};

export default NoteEditor;
