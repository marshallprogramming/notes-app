const STORAGE_KEY = "SURFE_SESSION_ID";

export function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
}

export function clearSessionId(): void {
  localStorage.removeItem(STORAGE_KEY);
}
