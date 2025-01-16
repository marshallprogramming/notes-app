import { getOrCreateSessionId } from "./session";

export interface RawUser {
  birthdate: number;
  email: string;
  first_name: string;
  gender: string;
  last_name: string;
  location: {
    city: string;
    postcode: string | number;
    state: string;
    street: string;
  };
  phone_number: string;
  title: string;
  username: string;
}

export interface UserForMention {
  username: string;
  fullName: string;
  email: string;
}

const BASE_API = "https://challenge.surfe.com";
const sessionId = getOrCreateSessionId();
const BASE_URL = `${BASE_API}/${sessionId}`;

export async function fetchUsersApi(): Promise<ReadonlyArray<RawUser>> {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
}

export function transformToMentionableUser(raw: RawUser): UserForMention {
  const fullName = `${raw.first_name} ${raw.last_name}`.trim();
  return {
    username: raw.username,
    fullName,
    email: raw.email,
  };
}
