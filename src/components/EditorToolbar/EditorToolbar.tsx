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
  activeFormats: {
    bold: boolean;
    italic: boolean;
    list: boolean;
    highlight: boolean;
    color: string | null;
  };
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onFormatText,
  activeFormats,
}) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const colors = ["black", "red", "blue", "green", "yellow"];

  const handleColorClick = (color: string) => {
    onFormatText("foreColor", color);
    setShowColorPicker(false);
  };

  const getButtonClass = (isActive: boolean) => `
    p-2 rounded transition-colors duration-200
    ${isActive ? "bg-gray-200 hover:bg-gray-300" : "hover:bg-gray-100"}
  `;

  return (
    <div className="border-b border-gray-200 p-2 flex items-center gap-2 justify-around">
      <button
        onMouseDown={(e) => {
          e.preventDefault(); // Prevent button from stealing focus
          onFormatText("bold");
        }}
        className={getButtonClass(activeFormats.bold)}
        data-testid="bold-button"
        title="Bold"
      >
        <BoldIcon className="w-4 h-4" />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onFormatText("italic");
        }}
        className={getButtonClass(activeFormats.italic)}
        data-testid="italic-button"
        title="Italic"
      >
        <ItalicIcon className="w-4 h-4" />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onFormatText(
            "backColor",
            activeFormats.highlight ? "transparent" : "yellow"
          );
        }}
        className={getButtonClass(activeFormats.highlight)}
        data-testid="highlight-button"
        title="Highlight"
      >
        <HighlighterIcon className="w-4 h-4" />
      </button>

      <div className="relative">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setShowColorPicker(!showColorPicker);
          }}
          className={getButtonClass(!!activeFormats.color)}
          data-testid="color-button"
          title="Text Color"
          style={{
            borderBottom: activeFormats.color
              ? `2px solid ${activeFormats.color}`
              : "none",
          }}
        >
          <PaletteIcon className="w-4 h-4" />
        </button>

        {showColorPicker && (
          <div className="absolute top-full right-0 mt-1 p-2 bg-white shadow-lg rounded border border-gray-200 flex gap-2 z-10">
            {colors.map((color) => (
              <button
                key={color}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleColorClick(color);
                }}
                className={`
                  w-6 h-6 rounded cursor-pointer
                  hover:ring-2 ring-offset-2 ring-gray-400
                  ${
                    activeFormats.color === color
                      ? "ring-2 ring-offset-2 ring-gray-400"
                      : ""
                  }
                `}
                style={{ backgroundColor: color }}
                data-testid={`color-${color}`}
                title={`Text color: ${color}`}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onFormatText("insertUnorderedList");
        }}
        className={getButtonClass(activeFormats.list)}
        data-testid="list-button"
        title="Bullet List"
      >
        <ListIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default EditorToolbar;
