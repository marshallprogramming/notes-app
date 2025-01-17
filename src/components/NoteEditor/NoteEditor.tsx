import { FC, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useMentionsStore } from "../../hooks/useMentionsStore";
import { useCaretMention } from "../../hooks/useCaretMention";
import MentionDropdown, {
  MentionDropdownRef,
} from "../MentionDropdown/MentionDropdown";
import CloseIcon from "../icons/CloseIcon";
import { useNotesStore } from "../../hooks/useNotesStore";
import { EditorToolbar } from "../EditorToolbar";

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
  const mentionDropdownRef = useRef<MentionDropdownRef>(null);

  const { selectNote } = useNotesStore();
  const fetchUsers = useMentionsStore((s) => s.fetchUsers);

  const [isFocused, setIsFocused] = useState(false);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    list: false,
    highlight: false,
    color: null as string | null,
  });

  const debouncedSave = useRef(
    debounce((data: { title: string; body: string }) => {
      onSave(data);
    }, SAVE_DELAY)
  ).current;

  const {
    isVisible: showMentions,
    query: mentionQuery,
    position: rawMentionPosition,
    handleKeyUp,
  } = useCaretMention(editorRef, handleChange);

  const [clampedPosition, setClampedPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  function handleChange() {
    const content = editorRef.current?.innerHTML || "";
    const title = titleRef.current?.value || "";
    const data = { title, body: content };

    onChange(data);
    debouncedSave(data);
  }

  const handleFormatText = (command: string, value?: string) => {
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

    if (!isFocused && editorRef.current) {
      editorRef.current.focus();
    }

    if (range) {
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    document.execCommand(command, false, value);

    checkFormatting();
    handleChange();
  };

  const insertMentionAtCaret = (username: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    const startContainer = range.startContainer;
    let startOffset = range.startOffset;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const textNode = startContainer as Text;

      while (startOffset > 0) {
        if (textNode.data.charAt(startOffset - 1) === "@") {
          range.setStart(textNode, startOffset - 1);
          break;
        }
        startOffset--;
      }
    }

    range.deleteContents();

    const mentionEl = document.createElement("span");
    mentionEl.classList.add("mention");
    mentionEl.contentEditable = "false";

    mentionEl.textContent = `@${username} `;

    range.insertNode(mentionEl);

    range.setStartAfter(mentionEl);
    range.setEndAfter(mentionEl);

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleMentionSelect = (username: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    insertMentionAtCaret(username);

    handleChange();
  };

  const checkFormatting = () => {
    if (!editorRef.current) return;

    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      list: document.queryCommandState("insertUnorderedList"),
      highlight: document.queryCommandValue("backColor") === "yellow",
      color:
        document.queryCommandValue("foreColor") === "rgb(0, 0, 0)"
          ? null
          : document.queryCommandValue("foreColor"),
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;

      if (modifierKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            handleFormatText("bold");
            break;
          case "i":
            e.preventDefault();
            handleFormatText("italic");
            break;
        }
      }
    };

    editorRef.current?.addEventListener("keydown", handleKeyDown);
    return () => {
      editorRef.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        checkFormatting();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

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
          className="cursor-pointer flex justify-center items-center p-2 opacity-80 transition-opacity duration-300 ease-in-out hover:opacity-100"
        >
          <CloseIcon />
        </div>
      </div>

      <EditorToolbar
        onFormatText={handleFormatText}
        activeFormats={activeFormats}
      />

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
          onMouseUp={checkFormatting}
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
