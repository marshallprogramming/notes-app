import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { useMentionsStore } from "../useMentionsStore";
import * as usersApi from "../../services/users";

describe("useMentionsStore", () => {
  beforeEach(() => {
    useMentionsStore.setState({ users: [] });
  });

  it("fetchUsers - should fetch from API, transform, and store", async () => {
    const mockRawUsers = [
      {
        birthdate: 608022796,
        email: "melany.wijngaard@example.com",
        first_name: "melany",
        last_name: "wijngaard",
        gender: "female",
        location: {
          city: "staphorst",
          postcode: 64265,
          state: "gelderland",
          street: "2431 predikherenkerkhof",
        },
        phone_number: "(727)-033-9347",
        title: "miss",
        username: "koala217",
      },
    ];

    const spy = vi
      .spyOn(usersApi, "fetchUsersApi")
      .mockResolvedValueOnce(mockRawUsers);

    await act(async () => {
      await useMentionsStore.getState().fetchUsers();
    });

    const state = useMentionsStore.getState();
    expect(state.users).toEqual([
      {
        username: "koala217",
        fullName: "melany wijngaard",
        email: "melany.wijngaard@example.com",
      },
    ]);

    spy.mockRestore();
  });

  it("searchMentions - should search by partial username or fullName", () => {
    useMentionsStore.setState({
      users: [
        {
          username: "koala217",
          fullName: "melany wijngaard",
          email: "melany.wijngaard@example.com",
        },
        {
          username: "bear893",
          fullName: "sarah oliver",
          email: "sarah.oliver@example.com",
        },
        {
          username: "frog218",
          fullName: "amelia mercier",
          email: "amelia.mercier@example.com",
        },
        {
          username: "cat785",
          fullName: "judith schmitz",
          email: "judith.schmitz@example.com",
        },
      ],
    });

    const results1 = useMentionsStore.getState().searchMentions("koa");
    expect(results1.map((r) => r.username)).toContain("koala217");
    expect(results1).toHaveLength(1);

    const results2 = useMentionsStore.getState().searchMentions("sarah");
    expect(results2.map((r) => r.username)).toContain("bear893");
  });
});
