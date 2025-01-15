import { describe, it, expect, beforeEach, vi } from "vitest";
import { getOrCreateSessionId, clearSessionId } from "../session";

describe("session", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should create a new session is none exists", () => {
    const mockUUID = "1234-1234-1234-1234-1234";
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

    const sessionId = getOrCreateSessionId();
    expect(sessionId).toBe(mockUUID);
    expect(localStorage.getItem("SURFE_SESSION_ID")).toBe(mockUUID);
  });

  it("should return the existing session if one is already stored", () => {
    localStorage.setItem("SURFE_SESSION_ID", "existing-session");
    const sessionId = getOrCreateSessionId();
    expect(sessionId).toBe("existing-session");
  });

  it("should clear the session ID", () => {
    localStorage.setItem("SURFE_SESSION_ID", "will-be-removed");
    clearSessionId();
    expect(localStorage.getItem("SURFE_SESSION_ID")).toBeNull();
  });
});
