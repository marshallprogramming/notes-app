import { create } from "zustand";
import {
  fetchUsersApi,
  transformToMentionableUser,
  UserForMention,
  RawUser,
} from "../services/users";

interface MentionsState {
  users: ReadonlyArray<UserForMention>;
  fetchUsers: () => Promise<void>;
  searchMentions: (query: string) => ReadonlyArray<UserForMention>;
}

export const useMentionsStore = create<MentionsState>((set, get) => ({
  users: [],

  fetchUsers: async () => {
    try {
      const rawUsers: ReadonlyArray<RawUser> = await fetchUsersApi();
      const mentionable = rawUsers.map(transformToMentionableUser);
      set({ users: mentionable });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },

  searchMentions: (query: string) => {
    const { users } = get();
    const normQuery = query.toLowerCase();

    const matching = users.filter((u) => {
      return (
        u.fullName.toLowerCase().includes(normQuery) ||
        u.username.toLowerCase().includes(normQuery)
      );
    });

    return matching.slice(0, 5);
  },
}));
