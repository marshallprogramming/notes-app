import { FC } from "react";
import { Note } from "../../services/notes";

interface NoteCard extends Omit<Note, "id"> {
  onClick: () => void;
}

const NoteCard: FC<NoteCard> = ({ title, body, lastUpdated, onClick }) => (
  <div
    onClick={onClick}
    className="rounded-sm bg-white h-52 w-full shadow-lg shadow-slate-300 p-6 text-left cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
  >
    <h3 className="max-w-[60ch] truncate text-ellipsis">{title}</h3>
    <p className="text-sm">Last update: {lastUpdated}</p>
    <p className="max-h-44 my-2 truncate text-ellipsis">{body}</p>
  </div>
);

export default NoteCard;
