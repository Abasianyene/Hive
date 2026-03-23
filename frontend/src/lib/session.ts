export interface SessionUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
}

export interface Session {
  token: string;
  user: SessionUser;
}

const STORAGE_KEY = "hive-session";

export function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setStoredSession(session: Session) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function updateStoredUser(user: SessionUser) {
  const currentSession = getStoredSession();

  if (!currentSession) {
    return null;
  }

  const nextSession = {
    ...currentSession,
    user,
  };

  setStoredSession(nextSession);
  return nextSession;
}
