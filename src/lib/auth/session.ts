// Stateless, signed-cookie session handling for the admin login.
//
// We deliberately don't pull in a full auth library (NextAuth/Auth.js) here:
// there is exactly one kind of account (admin users), no social login, no
// magic links -- just email + password. Next.js's own docs recommend this
// exact pattern (jose + httpOnly cookie) for that case. Fewer moving parts
// is more maintainable for a future owner than an auth library abstraction
// built for a much bigger problem than this app has.
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a random string of at least 32 characters in your environment (see .env.example).",
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  adminId: string;
  email: string;
  role: "OWNER" | "STAFF";
};

export async function encryptSession(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretKey());
}

export async function decryptSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSessionCookie(payload: SessionPayload) {
  const session = await encryptSession(payload);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const store = await cookies();
  store.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function readSessionCookie(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return decryptSession(token);
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
