import { getOrCreateSessionId } from "./session";

export interface Note {
  id: number;
  title: string;
  body: string;
  lastUpdated: string;
}

const BASE_API = "https://challenge.surfe.com";
const sessionId = getOrCreateSessionId();
const BASE_URL = `${BASE_API}/${sessionId}`;

export async function fetchNotesApi(): Promise<ReadonlyArray<Note>> {
  const res = await fetch(`${BASE_URL}/notes`);
  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }
  return res.json();
}

export async function createNoteApi(body: string): Promise<Note> {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) {
    throw new Error("Failed to create note");
  }
  return res.json();
}

export async function updateNoteApi(id: number, body: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) {
    throw new Error("Failed to update note");
  }
}
