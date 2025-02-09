import { getOrCreateSessionId } from "./session";

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
  lastUpdated: string;
}

const BASE_API = "https://challenge.surfe.com";

function getBaseUrl(): string {
  return `${BASE_API}/${getOrCreateSessionId()}`;
}

export const formatDate = (date: Date): string => {
  return date.toLocaleString("en-GB", {
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export async function fetchNotesApi(): Promise<
  ReadonlyArray<{ body: string; id: string }>
> {
  const res = await fetch(`${getBaseUrl()}/notes`);
  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }
  return res.json();
}

export async function createNoteApi(input: CreateNoteInput): Promise<Note> {
  const note = {
    title: input.title,
    body: input.body,
    lastUpdated: formatDate(new Date()),
  };

  const res = await fetch(`${getBaseUrl()}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: JSON.stringify(note) }),
  });

  if (!res.ok) {
    throw new Error("Failed to create note");
  }

  const generatedNote = await res.json();
  return { ...note, id: generatedNote.id };
}

export async function updateNoteApi({
  id,
  title,
  body,
  lastUpdated,
}: UpdateNoteInput): Promise<Note> {
  const updatedNote = {
    id,
    title,
    body,
    lastUpdated,
  };

  const res = await fetch(`${getBaseUrl()}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, body: JSON.stringify(updatedNote) }),
  });

  if (!res.ok) {
    throw new Error("Failed to update note");
  }

  return updatedNote;
}
