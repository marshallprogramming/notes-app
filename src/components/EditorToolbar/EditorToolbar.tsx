import React from "react";
import {
  BoldIcon,
  ItalicIcon,
  HighlighterIcon,
  PaletteIcon,
  ListIcon,
} from "../icons";

interface EditorToolbarProps {
  onFormatText: (command: string, value?: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onFormatText }) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const colors = ["red", "blue", "green", "purple", "yellow"];

  const handleColorClick = (color: string) => {
    onFormatText("foreColor", color);
    setShowColorPicker(false);
  };

  return (
    <div className="border-b border-gray-200 p-2 flex items-center gap-2 justify-around">
      <button
        onClick={() => onFormatText("bold")}
        className="p-2 hover:bg-gray-100 rounded"
        data-testid="bold-button"
        title="Bold"
      >
        <BoldIcon className="w-4 h-4" />
      </button>

      <button
        onClick={() => onFormatText("italic")}
        className="p-2 hover:bg-gray-100 rounded"
        data-testid="italic-button"
        title="Italic"
      >
        <ItalicIcon className="w-4 h-4" />
      </button>

      <button
        onClick={() => onFormatText("backColor", "yellow")}
        className="p-2 hover:bg-gray-100 rounded"
        data-testid="highlight-button"
        title="Highlight"
      >
        <HighlighterIcon className="w-4 h-4" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 hover:bg-gray-100 rounded"
          data-testid="color-button"
          title="Text Color"
        >
          <PaletteIcon className="w-4 h-4" />
        </button>

        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white shadow-lg rounded border border-gray-200 flex gap-2 z-10">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorClick(color)}
                className="w-6 h-6 rounded cursor-pointer hover:ring-2 ring-offset-2 ring-gray-400"
                style={{ backgroundColor: color }}
                data-testid={`color-${color}`}
                title={`Text color: ${color}`}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onFormatText("insertUnorderedList")}
        className="p-2 hover:bg-gray-100 rounded"
        data-testid="list-button"
        title="Bullet List"
      >
        <ListIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default EditorToolbar;
