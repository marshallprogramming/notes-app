import { FC } from "react";
import { PlusIcon } from "../icons";

interface BlankNoteCard {
  onClick: () => void;
}

const BlankNoteCard: FC<BlankNoteCard> = ({ onClick }) => (
  <div
    onClick={onClick}
    role="button"
    className="rounded-sm bg-white h-52 w-full border-dashed border-slate-300 border cursor-pointer transition-opacity duration-300 ease-in-out opacity-60 hover:opacity-100 flex justify-center items-center"
  >
    <PlusIcon fill="#cbd5e1" className="h-5 w-5" />
  </div>
);

export default BlankNoteCard;
