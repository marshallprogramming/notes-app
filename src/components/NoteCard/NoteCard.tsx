import { FC } from "react";
import { Note } from "../../services/notes";

// Use DOMParser to parse the HTML content reliably in JSDOM:
function decodeHTML(html: string): string {
  const parser = new DOMParser();
  // parse as text/html
  const doc = parser.parseFromString(html, "text/html");
  // return just the text content
  return doc.body.textContent || "";
}

interface NoteCardProps extends Omit<Note, "id"> {
  onClick: () => void;
}

const NoteCard: FC<NoteCardProps> = ({ title, body, lastUpdated, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="rounded-sm bg-white aspect-[4/3] max-h-56 sm:max-h-none w-full shadow-lg shadow-slate-300 p-6 text-left cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
    >
      <h3 className="max-w-[60ch] truncate text-ellipsis">{title}</h3>

      <p className="text-sm">Last update: {lastUpdated}</p>

      <p className="my-2 overflow-hidden text-ellipsis line-clamp-5">
        {decodeHTML(body)}
      </p>
    </div>
  );
};

export default NoteCard;
