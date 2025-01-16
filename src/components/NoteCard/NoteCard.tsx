import { FC } from "react";
import { Note } from "../../services/notes";

interface NoteCardProps extends Omit<Note, "id"> {
  onClick: () => void;
}

const decodeHTML = (html: string): string => {
  const txt = document.createElement("div");
  txt.innerHTML = html;
  return txt.innerText;
};

const NoteCard: FC<NoteCardProps> = ({ title, body, lastUpdated, onClick }) => (
  <div
    onClick={onClick}
    className="rounded-sm bg-white aspect-[4/3] max-h-56 sm:max-h-none w-full shadow-lg shadow-slate-300 p-6 text-left cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
  >
    <h3 className="max-w-[60ch] truncate text-ellipsis">{title}</h3>
    <p className="text-sm">Last update: {lastUpdated}</p>
    <p className="max-h-44 my-2 truncate text-ellipsis">{decodeHTML(body)}</p>
  </div>
);

export default NoteCard;
