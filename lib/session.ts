import { getIronSession, unsealData } from "iron-session";

export interface SessionData {
  isLoggedIn: boolean;
}

export const SESSION_COOKIE_NAME = "ghl-tracker-session";
const TTL = 60 * 60 * 24 * 7; // 7 days
export const SESSION_TTL = TTL;

export const sessionOptions = {
  cookieName: SESSION_COOKIE_NAME,
  password: process.env.SESSION_SECRET ?? "",
  ttl: TTL,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function getSession(
  cookies: Awaited<ReturnType<typeof import("next/headers").cookies>>
) {
  return getIronSession<SessionData>(cookies, sessionOptions);
}

/** Decode session from cookie value (for middleware/edge). */
export async function decodeSession(cookieValue: string): Promise<SessionData | null> {
  try {
    const data = await unsealData<SessionData>(cookieValue, {
      password: process.env.SESSION_SECRET ?? "",
      ttl: TTL,
    });
    return data;
  } catch {
    return null;
  }
}
