import { getOrCreateSessionId } from "./session";
import { v4 as uuidv4 } from "uuid";

export interface Note {
  id: string;
  title: string;
  body: string;
  lastUpdated: string;
}

export interface CreateNoteInput {
  title: string;
  body: string;
}

export interface UpdateNoteInput {
  id: string;
  title: string;
  body: string;
}

const BASE_API = "https://challenge.surfe.com";
const sessionId = getOrCreateSessionId();
const BASE_URL = `${BASE_API}/${sessionId}`;

const formatDate = (date: Date): string => {
  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export async function fetchNotesApi(): Promise<ReadonlyArray<Note>> {
  const res = await fetch(`${BASE_URL}/notes`);
  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }
  return res.json();
}

export async function createNoteApi(input: CreateNoteInput): Promise<Note> {
  const note = {
    id: uuidv4(),
    title: input.title,
    body: input.body,
    lastUpdated: formatDate(new Date()),
  };

  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: input.body }),
  });

  if (!res.ok) {
    throw new Error("Failed to create note");
  }

  return note;
}

export async function updateNoteApi({
  id,
  title,
  body,
}: UpdateNoteInput): Promise<Note> {
  const updatedNote = {
    id,
    title,
    body,
    lastUpdated: formatDate(new Date()),
  };

  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, body }),
  });

  if (!res.ok) {
    throw new Error("Failed to update note");
  }

  return updatedNote;
}
