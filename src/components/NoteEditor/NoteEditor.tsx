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

  const latestRangeRef = useRef<Range | null>(null);
  // Stores the latest selection range

  const { selectNote } = useNotesStore();
  const fetchUsers = useMentionsStore((s) => s.fetchUsers);

  const [isFocused, setIsFocused] = useState(false);

  // Track active text formats
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    list: false,
    highlight: false,
    color: null as string | null,
  });

  // Ref to prevent multiple initialContent sets
  const contentSetRef = useRef(false);

  // Debounced saving
  const debouncedSave = useRef(
    debounce((data: { title: string; body: string }) => {
      onSave(data);
    }, SAVE_DELAY)
  ).current;

  // Mention detection and handling
  const {
    isVisible: showMentions,
    query: mentionQuery,
    position: rawMentionPosition,
    handleKeyUp,
  } = useCaretMention(editorRef, handleChange);

  // Position for the mention dropdown
  const [clampedPosition, setClampedPosition] = useState({ top: 0, left: 0 });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Initialize editor's content only once
  useEffect(() => {
    if (editorRef.current && initialContent && !contentSetRef.current) {
      editorRef.current.innerHTML = initialContent;
      contentSetRef.current = true;
      // Initialize the latestRangeRef to the end of the content
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        latestRangeRef.current = range;
      }
    }
  }, [initialContent]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  /**
   * Handles any changes within the editor or title
   */
  function handleChange() {
    const content = editorRef.current?.innerHTML || "";
    const title = titleRef.current?.value || "";
    const data = { title, body: content };

    onChange(data);
    debouncedSave(data);
  }

  /**
   * Formats text (bold, italic, etc.) while preserving the selection
   */
  const handleFormatText = (command: string, value?: string) => {
    // Restore the latest selection range
    const selection = window.getSelection();
    if (selection && latestRangeRef.current) {
      selection.removeAllRanges();
      selection.addRange(latestRangeRef.current);
    }

    // Execute the formatting command
    document.execCommand(command, false, value);

    // Update active formats
    checkFormatting();

    // Update the latest range
    if (selection && selection.rangeCount > 0) {
      latestRangeRef.current = selection.getRangeAt(0);
    }

    // Trigger change
    handleChange();
  };

  /**
   * Inserts a mention at the current caret position, replacing the '@' and typed characters
   */
  const insertMentionAtCaret = (username: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Expand the range backward to find '@'
    const startContainer = range.startContainer;
    let startOffset = range.startOffset;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const textNode = startContainer as Text;

      while (startOffset > 0) {
        const char = textNode.data.charAt(startOffset - 1);
        if (char === "@") {
          range.setStart(textNode, startOffset - 1);
          break;
        }
        startOffset--;
      }
    }

    // Remove the '@' and the typed characters
    range.deleteContents();

    // Create the mention span
    const mentionEl = document.createElement("span");
    mentionEl.classList.add("mention"); // For CSS styling
    mentionEl.contentEditable = "false";
    mentionEl.textContent = `@${username} `; // Trailing space for convenience

    // Insert the mention span
    range.insertNode(mentionEl);

    // Move the caret after the mention
    range.setStartAfter(mentionEl);
    range.setEndAfter(mentionEl);

    // Update the selection
    selection.removeAllRanges();
    selection.addRange(range);

    // Update the latest range
    latestRangeRef.current = range;
  };

  /**
   * Handles the selection of a mention from the dropdown
   */
  const handleMentionSelect = (username: string) => {
    if (!editorRef.current) return;

    // Focus the editor to ensure Range APIs work correctly
    editorRef.current.focus();

    // Restore the latest selection range
    const selection = window.getSelection();
    if (selection && latestRangeRef.current) {
      selection.removeAllRanges();
      selection.addRange(latestRangeRef.current);
    }

    // Insert the mention
    insertMentionAtCaret(username);

    // Trigger change
    handleChange();
  };

  /**
   * Updates the active formatting states (bold, italic, etc.)
   */
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

  /**
   * Keyboard shortcuts (Ctrl/Cmd + B/I)
   */
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

  /**
   * Listen for selection changes to keep track of the latest range and update formatting
   */
  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          latestRangeRef.current = selection.getRangeAt(0);
        }
        checkFormatting();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  /**
   * Clamp the mention dropdown position within the editor bounds
   */
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

  /**
   * Forward keyUp events to the mention detection hook
   */
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
