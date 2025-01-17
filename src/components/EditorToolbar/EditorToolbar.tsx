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
  const [showTooltip, setShowTooltip] = React.useState<string | null>(null);

  const colors = ["black", "red", "blue", "green", "yellow"];

  const handleColorClick = (color: string) => {
    onFormatText("foreColor", color);
    setShowColorPicker(false);
  };

  const getButtonClass = (isActive: boolean, isDisabled?: boolean) => `
    p-2 rounded transition-colors duration-200 relative
    ${isActive ? "bg-gray-200 hover:bg-gray-300" : "hover:bg-gray-100"}
    ${isDisabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}
  `;

  return (
    <div className="border-b border-gray-200 p-2 flex items-center gap-2 justify-around">
      <button
        onMouseDown={(e) => {
          e.preventDefault();
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

      <div
        className="relative"
        onMouseEnter={() => setShowTooltip("highlight")}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <button
          className={getButtonClass(activeFormats.highlight, true)}
          data-testid="highlight-button"
          disabled // TODO: Highlight and unhighlight text
        >
          <HighlighterIcon className="w-4 h-4" />
          <div className="absolute top-0 right-0 w-2 h-2">
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-red-500 fill-current"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </div>
        </button>
      </div>

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

      <div
        className="relative"
        onMouseEnter={() => setShowTooltip("list")}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <button
          className={getButtonClass(activeFormats.list, true)}
          data-testid="list-button"
          disabled // TODO: Enable bullet points/lists
        >
          <ListIcon className="w-4 h-4" />
          <div className="absolute top-0 right-0 w-2 h-2">
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-red-500 fill-current"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
